import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../shared/entity/base.entity';
import { User } from '../../user/entity/user.entity';

@Entity('tokens')
export class Token extends BaseEntity {
  @Column({ type: 'text' })
  token: string;

  @Column({ type: 'timestamp', nullable: true })
  expires_at: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
