import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { User } from '../../user/entity/user.entity';
import { BaseEntity } from '../../../shared/entity/base.entity';

@Entity('notifications')
export class Notification extends BaseEntity {
  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text' })
  message: string;

  @Column({ type: 'boolean', default: false })
  isRead: boolean;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
