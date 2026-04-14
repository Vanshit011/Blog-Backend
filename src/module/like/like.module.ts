import { Module } from '@nestjs/common';
import { LikeController } from './like.controller';
import { LikeService } from './like.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Like } from './entity/like.entity';
import { Blog } from '../blog/entity/blog.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Like, Blog])],
  controllers: [LikeController],
  providers: [LikeService],
  exports: [LikeService],
})
export class LikeModule {}
