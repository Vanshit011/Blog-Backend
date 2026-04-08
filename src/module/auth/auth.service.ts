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
import { FirebaseService } from './strategies/firebase.strategy';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { SignupDto, LoginDto } from './dto/auth-credentials.dto';
import { User } from '../user/entity/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly firebaseService: FirebaseService,
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
        photo_url: googleUser.picture,
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
        photo_url: googleUser.picture,
      });
    }

    return this.generateAuthResponse(user, requiredRole);
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

      return this.generateAuthResponse(user, requiredRole);
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

      this.userService
        .update(user.id, {
          firebase_id: firebaseUser.uid,
          last_login: new Date(),
        })
        .catch((err) => console.error('Login update failed', err));

      return this.generateAuthResponse(user, requiredRole);
    } catch {
      console.log('An error occurred');
    }
  }

  private generateAuthResponse(user: User, requiredRole: UserRole) {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    return {
      message: `${requiredRole.charAt(0).toUpperCase() + requiredRole.slice(1)} logged in successfully`,
      user: {
        id: user.id,
        email: user.email,
        display_name: user.display_name,
        photo_url: user.photo_url,
      },
      access_token: this.jwtService.sign(payload),
    };
  }
}
