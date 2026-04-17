import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { statusbar } from '../../../shared/constants/enum';
import { User } from '../../user/entity/user.entity';
import { BaseEntity } from '../../../shared/entity/base.entity';
import { Like } from '../../like/entity/like.entity';
import { Comment } from '../../comment/entity/comment.entity';
import { Category } from '../../category/entity/category.entity';

@Entity('blogs')
export class Blog extends BaseEntity {
  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  slug: string;

  @Column({
    type: 'enum',
    enum: statusbar,
    default: statusbar.DRAFT,
  })
  status: statusbar;

  @Column({ name: 'cover_image', type: 'varchar', length: 500 })
  cover_image: string;

  @ManyToOne('User', (user: User) => user.blogs)
  @JoinColumn({ name: 'author_id' })
  author: User;

  @OneToMany(() => Like, (like) => like.blog)
  likes: Like[];

  @OneToMany(() => Comment, (comment) => comment.blog)
  comments: Comment[];

  @ManyToOne(() => Category, (category) => category.blogs)
  @JoinColumn({ name: 'category_id' })
  category: Category;
}
