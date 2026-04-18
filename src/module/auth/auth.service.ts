import {
  Injectable,
  UnauthorizedException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { UserRole } from '../../shared/constants/enum';
import { GoogleUser } from '../../shared/constants/types';
import { FirebaseService } from '../firebase/firebase.service';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { SignupDto, LoginDto } from './dto/auth-credentials.dto';
import { User } from '../user/entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Token } from './entity/token.entity';
import { Repository } from 'typeorm';
import { JwtTokenPayload } from '../../shared/constants/types';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly firebaseService: FirebaseService,
    @InjectRepository(Token)
    private readonly tokenRepository: Repository<Token>,
  ) {}

  async googleLogin(googleUser: GoogleUser, requiredRole: UserRole) {
    if (!googleUser) {
      throw new UnauthorizedException('No user from google');
    }

    let user = await this.userService.findByGoogleId(googleUser.google_id);

    if (!user) {
      user = await this.userService.findByEmail(googleUser.email);
    }

    if (!user) {
      user = await this.userService.create({
        google_id: googleUser.google_id,
        email: googleUser.email,
        first_name: googleUser.firstName,
        last_name: googleUser.lastName,
        display_name: `${googleUser.firstName} ${googleUser.lastName}`,
        // profile_picture: googleUser.picture,
        role: requiredRole,
        last_login: new Date(),
      });
    } else {
      // Check if user has the required role
      if (user.role !== requiredRole) {
        throw new ForbiddenException(
          `User is registered as ${user.role}, but trying to login as ${requiredRole}`,
        );
      }

      user = await this.userService.update(user.id, {
        google_id: googleUser.google_id,
        first_name: googleUser.firstName,
        last_name: googleUser.lastName,
        last_login: new Date(),
        // profile_picture: googleUser.picture,
      });
    }

    return await this.generateAuthResponse(user, requiredRole);
  }

  async signup(credentials: SignupDto, requiredRole: UserRole) {
    const { email, password, firstName, lastName } = credentials;
    try {
      const userCredential = await createUserWithEmailAndPassword(
        this.firebaseService.getAuth(),
        email,
        password,
      );
      const firebaseUser = userCredential.user;

      const user = await this.userService.create({
        firebase_id: firebaseUser.uid,
        email: firebaseUser.email || email,
        first_name: firstName,
        last_name: lastName,
        display_name: `${firstName} ${lastName}`,
        role: requiredRole,
        last_login: new Date(),
      });

      return await this.generateAuthResponse(user, requiredRole);
    } catch (error: unknown) {
      let message = 'Unknown signup error';
      if (error instanceof Error) {
        message = error.message;
      }
      throw new BadRequestException(message);
    }
  }

  async login(credentials: LoginDto, requiredRole: UserRole) {
    const { email, password } = credentials;

    try {
      const userCredential = await signInWithEmailAndPassword(
        this.firebaseService.getAuth(),
        email,
        password,
      );
      const firebaseUser = userCredential.user;

      if (!firebaseUser.email) {
        throw new Error('User email is missing');
      }
      const user = await this.userService.findByEmail(firebaseUser.email);

      if (!user) {
        throw new UnauthorizedException('User not found in local database');
      }

      if (user.role !== requiredRole) {
        throw new ForbiddenException(
          `User is registered as ${user.role}, but trying to login as ${requiredRole}`,
        );
      }

      await this.userService.update(user.id, {
        firebase_id: firebaseUser.uid,
        last_login: new Date(),
      });

      return await this.generateAuthResponse(user, requiredRole);
    } catch (error: unknown) {
      console.error('Login error:', error);
      let message = 'Login failed';
      if (error instanceof Error) {
        message = error.message;
      }
      throw new UnauthorizedException(message);
    }
  }

  private async generateAuthResponse(user: User, requiredRole: UserRole) {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const decodedToken: JwtTokenPayload = Object(
      this.jwtService.decode(accessToken),
    );
    const expiresAt = decodedToken?.exp
      ? new Date(decodedToken.exp * 1000)
      : undefined;

    // Check if a valid token already exists for this user
    const existingToken = await this.tokenRepository.findOne({
      where: { user: { id: user.id } },
    });

    let tokenEntity: Token;

    if (
      existingToken &&
      existingToken.expires_at &&
      existingToken.expires_at > new Date()
    ) {
      // Token exists and is not expired, update it
      existingToken.token = accessToken;
      existingToken.expires_at = expiresAt || null;
      tokenEntity = await this.tokenRepository.save(existingToken);
    } else {
      // Token doesn't exist or is expired, create a new one
      tokenEntity = this.tokenRepository.create({
        token: accessToken,
        user: user,
        expires_at: expiresAt,
      });
      await this.tokenRepository.save(tokenEntity);
    }

    return {
      message: `${requiredRole.charAt(0).toUpperCase() + requiredRole.slice(1)} logged in successfully`,
      user: {
        id: user.id,
        email: user.email,
        display_name: user.display_name,
        profile_picture: user.profile_picture,
      },
      access_token: accessToken,
    };
  }
}
