import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './entity/comment.entity';
import { Blog } from '../blog/entity/blog.entity';
import { NotificationService } from '../notifications/notifications.service';
import { User } from '../user/entity/user.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    @InjectRepository(Blog)
    private readonly blogRepository: Repository<Blog>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly notificationService: NotificationService,
  ) {}

  async addComment(userId: string, blogId: string, content: string) {
    const blog = await this.blogRepository.findOne({ where: { id: blogId } });
    if (!blog) {
      throw new BadRequestException('Blog not found');
    }

    const comment = this.commentRepository.create({
      user: { id: userId },
      blog: { id: blogId },
      content,
    });
    await this.commentRepository.save(comment);

    try {
      const blog = await this.blogRepository.findOne({
        where: { id: blogId },
        relations: ['author'],
      });

      if (blog && blog.author && blog.author.id !== userId) {
        const commenter = await this.userRepository.findOne({
          where: { id: userId },
        });
        const commenterName = commenter?.display_name || 'Someone';

        await this.notificationService.createNotification(
          blog.author.id,
          `New Comment on "${blog.title}"`,
          `${commenterName} commented on your blog.`,
        );
      }
    } catch (error) {
      console.error('Failed to send notification:', error);
    }

    return { message: 'Comment added successfully' };
  }

  async deleteComment(userId: string, commentId: string) {
    const comment = await this.commentRepository.findOne({
      where: { id: commentId },
      relations: ['user'],
    });
    if (!comment) {
      throw new BadRequestException('Comment not found');
    }

    if (comment.user.id !== userId) {
      throw new BadRequestException(
        'You are not authorized to delete this comment',
      );
    }

    await this.commentRepository.delete(comment);

    return { message: 'Comment deleted successfully' };
  }
}
