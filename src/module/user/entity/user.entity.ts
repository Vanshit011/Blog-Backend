import { BaseEntity } from '../../../shared/entity/base.entity';
import { Entity, Column, OneToMany } from 'typeorm';
import { UserRole } from '../../../shared/constants/enum';
import { Blog } from '../../blog/entity/blog.entity';
import { Like } from '../../like/entity/like.entity';
import { Comment } from '../../comment/entity/comment.entity';

@Entity('users')
export class User extends BaseEntity {
  @Column({ type: 'varchar', length: 255, nullable: true, unique: true })
  google_id: string;

  @Column({
    type: 'character varying',
    length: 255,
    nullable: true,
    unique: true,
  })
  firebase_id: string;

  @Column({ type: 'character varying', length: 255, unique: true })
  email: string;

  @Column({ type: 'character varying', length: 255, nullable: true })
  first_name: string;

  @Column({ type: 'character varying', length: 255, nullable: true })
  last_name: string;

  @Column({ type: 'character varying', length: 255, nullable: true })
  display_name: string;

  @Column({ type: 'character varying', length: 255, nullable: true })
  photo_url: string;

  @Column({ type: 'text', nullable: true })
  about: string;

  @Column({ type: 'varchar', length: 255, nullable: true, unique: true })
  username: string;

  @Column({ type: 'timestamp', nullable: true })
  last_login: Date;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @OneToMany(() => Blog, (blog) => blog.author)
  blogs: Blog[];

  @OneToMany(() => Like, (like) => like.user)
  likes: Like[];

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];
}
