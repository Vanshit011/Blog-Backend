import { Module } from '@nestjs/common';
import { AuthController } from './controllers/user-auth.controller';
import { AuthService } from './auth.service';
import { FirebaseService } from './strategies/firebase.strategy';
import { GoogleStrategy } from './strategies/google.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from '../user/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Token } from './entity/token.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Token]),
    ConfigModule,
    UserModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: (configService.get<string>('JWT_EXPIRES_IN') ||
            '1h') as any as number,
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, FirebaseService, GoogleStrategy, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
