import { Module } from '@nestjs/common';
import { BlogService } from './blog.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Blog } from './entity/blog.entity';
import { AIModule } from '../ai/ai.module';
import { NotificationModule } from '../notifications/notifications.module';
import { BlogController } from './blog.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Blog]), AIModule, NotificationModule],
  controllers: [BlogController],
  providers: [BlogService],
  exports: [BlogService],
})
export class BlogModule {}
