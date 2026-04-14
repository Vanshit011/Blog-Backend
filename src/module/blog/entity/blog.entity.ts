import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { statusbar } from '../../../shared/constants/enum';
import { User } from '../../user/entity/user.entity';
import { BaseEntity } from '../../../shared/entity/base.entity';

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

  @Column({ name: 'cover_image', type: 'varchar', length: 500, nullable: true })
  coverImage: string;

  @ManyToOne('User', (user: User) => user.blogs)
  @JoinColumn({ name: 'author_id' })
  author: User;
}
