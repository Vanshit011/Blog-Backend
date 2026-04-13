import { Module } from '@nestjs/common';
import { BlogService } from './blog.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entity/user.entity';
import { Blog } from './entity/blog.entity';
import { BlogController } from './blog.controller';

import { AIModule } from '../ai/ai.module';

@Module({
  imports: [TypeOrmModule.forFeature([Blog, User]), AIModule],
  controllers: [BlogController],
  providers: [BlogService],
  exports: [BlogService],
})
export class BlogModule {}
