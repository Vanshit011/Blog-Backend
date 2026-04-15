import { Entity, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { User } from '../../user/entity/user.entity';
import { BaseEntity } from '../../../shared/entity/base.entity';

@Entity('follows')
@Unique(['follower', 'following'])
export class Follow extends BaseEntity {
  @ManyToOne(() => User, (user: User) => user.following, { eager: true })
  @JoinColumn({ name: 'follower_id' })
  follower: User;

  @ManyToOne(() => User, (user: User) => user.followers, { eager: true })
  @JoinColumn({ name: 'following_id' })
  following: User;
}
