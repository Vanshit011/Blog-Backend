import { Entity, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../user/entity/user.entity';
import { Blog } from '../../blog/entity/blog.entity';
import { BaseEntity } from '../../../shared/entity/base.entity';

@Entity('likes')
export class Like extends BaseEntity {
  @ManyToOne(() => User, (user) => user.likes)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Blog, (blog) => blog.likes)
  @JoinColumn({ name: 'blog_id' })
  blog: Blog;
}
