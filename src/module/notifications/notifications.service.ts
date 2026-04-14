import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Notification } from './entity/notifications.entity';
import { Repository } from 'typeorm';
import { User } from '../user/entity/user.entity';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createNotification(
    userId: string,
    title: string,
    message: string,
  ): Promise<Notification> {
    const notification = this.notificationRepository.create({
      user: { id: userId },
      title,
      message,
    });
    return this.notificationRepository.save(notification);
  }

  async notifyAllUsers(title: string, message: string): Promise<void> {
    const users = await this.userRepository.find();
    const notifications = users.map((user) =>
      this.notificationRepository.create({
        user: { id: user.id },
        title,
        message,
      }),
    );
    await this.notificationRepository.save(notifications);
  }

  async getUserNotifications(userId: string): Promise<Notification[]> {
    return this.notificationRepository.find({
      where: { user: { id: userId } },
      order: { created_at: 'DESC' },
    });
  }

  async markAsRead(notificationId: string): Promise<void> {
    await this.notificationRepository.update(notificationId, { isRead: true });
  }
}
