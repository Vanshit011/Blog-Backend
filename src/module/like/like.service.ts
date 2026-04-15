import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Like } from './entity/like.entity';
import { Blog } from '../blog/entity/blog.entity';

@Injectable()
export class LikeService {
  constructor(
    @InjectRepository(Like)
    private readonly likeRepository: Repository<Like>,
    @InjectRepository(Blog)
    private readonly blogRepository: Repository<Blog>,
  ) {}

  async like(userId: string, blogId: string) {
    const blog = await this.blogRepository.findOne({ where: { id: blogId } });
    if (!blog) {
      throw new BadRequestException('Blog not found');
    }

    const existingLike = await this.likeRepository.findOne({
      where: { user: { id: userId }, blog: { id: blogId } },
    });

    if (existingLike) {
      throw new BadRequestException('You already liked this blog');
    }

    const like = this.likeRepository.create({
      user: { id: userId },
      blog: { id: blogId },
    });
    await this.likeRepository.save(like);

    return { message: 'Blog liked successfully' };
  }

  async unlike(userId: string, blogId: string) {
    const blog = await this.blogRepository.findOne({ where: { id: blogId } });
    if (!blog) {
      throw new BadRequestException('Blog not found');
    }

    const like = await this.likeRepository.findOne({
      where: { user: { id: userId }, blog: { id: blogId } },
    });

    if (!like) {
      throw new BadRequestException('You have not liked this blog');
    }

    await this.likeRepository.remove(like);

    return { message: 'Blog unliked successfully' };
  }

  async getLikes(blogId: string, userId?: string) {
    const count = await this.likeRepository.count({
      where: { blog: { id: blogId } },
    });

    let isLiked = false;
    if (userId) {
      const existing = await this.likeRepository.findOne({
        where: { user: { id: userId }, blog: { id: blogId } },
      });
      isLiked = !!existing;
    }

    return { count, isLiked };
  }
}
