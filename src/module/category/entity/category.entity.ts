import { BaseEntity } from '../../../shared/entity/base.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { Blog } from '../../blog/entity/blog.entity';

@Entity('categories')
export class Category extends BaseEntity {
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @OneToMany(() => Blog, (blog) => blog.category)
  blogs: Blog[];
}
