import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Req,
  Res,
} from '@nestjs/common';
import { AuthService } from '../auth.service';
import { UserRole } from '../../../shared/constants/enum';
import { GoogleUser } from '../../../shared/constants/types';
import { SignupDto, LoginDto } from '../dto/auth-credentials.dto';
import { GoogleAuthGuard } from '../strategies/google-auth.guard';
import { Request, Response } from 'express';

interface OAuthState {
  role: string;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('user/google/login')
  @UseGuards(GoogleAuthGuard)
  async googleLoginInitiate() {
    // This will redirect to Google
  }

  @Get('admin/google/login')
  @UseGuards(GoogleAuthGuard)
  async adminGoogleLoginInitiate() {
    // This will redirect to Google
  }

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleCallback(@Req() req: Request, @Res() res: Response) {
    const user = req.user as unknown as GoogleUser;
    const state = req.query.state
      ? (JSON.parse(req.query.state as string) as OAuthState)
      : { role: 'user' };
    const role = state.role === 'admin' ? UserRole.ADMIN : UserRole.USER;

    const result = await this.authService.googleLogin(user, role);
    const frontendUrl = process.env.FRONTEND_URL;

    const redirectPath = role === UserRole.ADMIN ? '/admin/login' : '/login';
    return res.redirect(
      `${frontendUrl}${redirectPath}?token=${result.access_token}`,
    );
  }

  @Post('user/google/login')
  async googleLogin(@Body() body: GoogleUser) {
    return this.authService.googleLogin(body, UserRole.USER);
  }

  @Post('admin/google/login')
  async adminGoogleLogin(@Body() body: GoogleUser) {
    return this.authService.googleLogin(body, UserRole.ADMIN);
  }

  @Post('user/signup')
  async signup(@Body() body: SignupDto) {
    return this.authService.signup(body, UserRole.USER);
  }

  @Post('user/login')
  async login(@Body() body: LoginDto) {
    return this.authService.login(body, UserRole.USER);
  }
}
