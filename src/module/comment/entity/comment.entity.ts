import { BaseEntity } from '../../../shared/entity/base.entity';
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../user/entity/user.entity';
import { Blog } from '../../blog/entity/blog.entity';

@Entity('comments')
export class Comment extends BaseEntity {
  @Column({ type: 'text' })
  content: string;

  @ManyToOne(() => User, (user) => user.comments)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Blog, (blog) => blog.comments)
  @JoinColumn({ name: 'blog_id' })
  blog: Blog;
}
