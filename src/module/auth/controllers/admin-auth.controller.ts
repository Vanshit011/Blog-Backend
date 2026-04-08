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
import { LoginDto } from '../dto/auth-credentials.dto';
import { GoogleUser } from '../../../shared/constants/types';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';

@Controller('auth/admin')
export class AdminAuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('google/login')
  @UseGuards(AuthGuard('google'))
  async googleLoginInitiate() {
    // This will redirect to Google
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleLoginCallback(@Req() req: Request, @Res() res: Response) {
    const user = req.user as unknown as GoogleUser;
    const result = await this.authService.googleLogin(user, UserRole.ADMIN);
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    return res.redirect(
      `${frontendUrl}/admin/login?token=${result.access_token}`,
    );
  }

  @Post('google/login')
  async googleLogin(@Body() body: GoogleUser) {
    return this.authService.googleLogin(body, UserRole.ADMIN);
  }

  @Post('login')
  async login(@Body() body: LoginDto) {
    return this.authService.login(body, UserRole.ADMIN);
  }
}
