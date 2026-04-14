import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { typeOrmConfig } from './config/typeorm.config';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './module/user/user.module';
import { AuthModule } from './module/auth/auth.module';
import { BlogModule } from './module/blog/blog.module';
import { NotificationModule } from './module/notifications/notifications.module';
import { LikeModule } from './module/like/like.module';
import { CommentModule } from './module/comment/comment.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`env/.env.${process.env.NODE_ENV || 'development'}`],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: typeOrmConfig,
    }),
    UserModule,
    AuthModule,
    BlogModule,
    NotificationModule,
    LikeModule,
    CommentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
