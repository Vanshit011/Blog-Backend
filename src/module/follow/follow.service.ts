import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Follow } from './entity/follow.entity';
import { User } from '../user/entity/user.entity';
import { NotificationService } from '../notifications/notifications.service';

@Injectable()
export class FollowService {
  constructor(
    @InjectRepository(Follow)
    private readonly followRepository: Repository<Follow>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly notificationService: NotificationService,
  ) {}

  async follow(followerId: string, followingId: string) {
    try {
      if (followerId === followingId) {
        throw new BadRequestException('You cannot follow yourself');
      }

      const userToFollow = await this.userRepository.findOne({
        where: { id: followingId },
      });
      if (!userToFollow) {
        throw new NotFoundException('User not found');
      }

      const existingFollow = await this.followRepository.findOne({
        where: {
          follower: { id: followerId },
          following: { id: followingId },
        },
      });

      if (existingFollow) {
        throw new BadRequestException('You are already following this user');
      }

      const follow = this.followRepository.create({
        follower: { id: followerId },
        following: { id: followingId },
      });
      await this.notificationService.createNotification(
        followingId,
        `New Follower "${userToFollow.display_name}"`,
        `${userToFollow.display_name} followed you`,
      );
      await this.followRepository.save(follow);
    } catch (error) {
      console.log('Error in follow:', error);
    }

    return { message: 'User followed successfully' };
  }

  async unfollow(followerId: string, followingId: string) {
    try {
      if (followerId === followingId) {
        throw new BadRequestException('You cannot unfollow yourself');
      }

      const follow = await this.followRepository.findOne({
        where: {
          follower: { id: followerId },
          following: { id: followingId },
        },
      });

      if (!follow) {
        throw new BadRequestException('You are not following this user');
      }

      await this.followRepository.remove(follow);
    } catch (error) {
      console.log('Error in unfollow:', error);
    }

    return { message: 'User unfollowed successfully' };
  }

  async getFollowers(userId: string) {
    try {
      const followers = await this.followRepository.find({
        where: { following: { id: userId } },
        relations: ['follower'],
        select: {
          id: true,
          created_at: true,
          follower: {
            id: true,
            first_name: true,
            last_name: true,
            display_name: true,
            user_name: true,
          },
        },
      });

      return {
        count: followers.length,
        followers: followers.map((f) => ({
          id: f.follower.id,
          first_name: f.follower.first_name,
          last_name: f.follower.last_name,
          display_name: f.follower.display_name,
          user_name: f.follower.user_name,
          followed_at: f.created_at,
        })),
      };
    } catch (error) {
      console.log('Error in getFollowers:', error);
    }
  }

  async getFollowing(userId: string) {
    try {
      const following = await this.followRepository.find({
        where: { follower: { id: userId } },
        relations: ['following'],
        select: {
          id: true,
          created_at: true,
          following: {
            id: true,
            first_name: true,
            last_name: true,
            display_name: true,
            user_name: true,
          },
        },
      });

      return {
        count: following.length,
        following: following.map((f) => ({
          id: f.following.id,
          first_name: f.following.first_name,
          last_name: f.following.last_name,
          display_name: f.following.display_name,
          username: f.following.user_name,
          followed_at: f.created_at,
        })),
      };
    } catch (error) {
      console.log('Error in getFollowing:', error);
    }
  }

  async getFollowStats(targetUserId: string, currentUserId?: string) {
    try {
      const followersCount = await this.followRepository.count({
        where: { following: { id: targetUserId } },
      });

      const followingCount = await this.followRepository.count({
        where: { follower: { id: targetUserId } },
      });

      let isFollowing = false;
      if (currentUserId && currentUserId !== targetUserId) {
        const follow = await this.followRepository.findOne({
          where: {
            follower: { id: currentUserId },
            following: { id: targetUserId },
          },
        });
        isFollowing = !!follow;
      }
      return { followersCount, followingCount, isFollowing };
    } catch (error) {
      console.log('Error in getFollowStats:', error);
      throw error;
    }
  }

  //admin

  async adminFollow(userId: string, adminId: string) {
    try {
      if (userId === adminId) {
        throw new BadRequestException('You cannot follow yourself');
      }

      const userToFollow = await this.userRepository.findOne({
        where: { id: userId },
      });
      if (!userToFollow) {
        throw new NotFoundException('User not found');
      }

      const existingFollow = await this.followRepository.findOne({
        where: {
          follower: { id: adminId },
          following: { id: userId },
        },
      });

      if (existingFollow) {
        throw new BadRequestException('You are already following this user');
      }

      const follow = this.followRepository.create({
        follower: { id: adminId },
        following: { id: userId },
      });
      await this.notificationService.createNotification(
        userId,
        `New Follower "${userToFollow.display_name}"`,
        `${userToFollow.display_name} followed you`,
      );
      await this.followRepository.save(follow);
    } catch (error) {
      console.log('Error in follow:', error);
    }

    return { message: 'User followed successfully' };
  }

  async adminUnfollow(userId: string, adminId: string) {
    try {
      if (userId === adminId) {
        throw new BadRequestException('You cannot unfollow yourself');
      }

      const follow = await this.followRepository.findOne({
        where: {
          follower: { id: adminId },
          following: { id: userId },
        },
      });

      if (!follow) {
        throw new BadRequestException('You are not following this user');
      }

      await this.followRepository.remove(follow);
    } catch (error) {
      console.log('Error in unfollow:', error);
    }

    return { message: 'User unfollowed successfully' };
  }

  async adminGetFollowers(adminId: string) {
    try {
      const followers = await this.followRepository.find({
        where: { following: { id: adminId } },
        relations: ['follower'],
        select: {
          id: true,
          created_at: true,
          follower: {
            id: true,
            first_name: true,
            last_name: true,
            display_name: true,
            user_name: true,
          },
        },
      });

      return {
        count: followers.length,
        followers: followers.map((f) => ({
          id: f.follower.id,
          first_name: f.follower.first_name,
          last_name: f.follower.last_name,
          display_name: f.follower.display_name,
          user_name: f.follower.user_name,
          followed_at: f.created_at,
        })),
      };
    } catch (error) {
      console.log('Error in getFollowers:', error);
    }
  }

  async adminGetFollowing(adminId: string) {
    try {
      const following = await this.followRepository.find({
        where: { follower: { id: adminId } },
        relations: ['following'],
        select: {
          id: true,
          created_at: true,
          following: {
            id: true,
            first_name: true,
            last_name: true,
            display_name: true,
            user_name: true,
          },
        },
      });

      return {
        count: following.length,
        following: following.map((f) => ({
          id: f.following.id,
          first_name: f.following.first_name,
          last_name: f.following.last_name,
          display_name: f.following.display_name,
          user_name: f.following.user_name,
          followed_at: f.created_at,
        })),
      };
    } catch (error) {
      console.log('Error in getFollowing:', error);
    }
  }

  async adminGetFollowStats(targetUserId: string, adminId?: string) {
    try {
      const followersCount = await this.followRepository.count({
        where: { following: { id: targetUserId } },
      });

      const followingCount = await this.followRepository.count({
        where: { follower: { id: targetUserId } },
      });

      let isFollowing = false;
      if (adminId && adminId !== targetUserId) {
        const follow = await this.followRepository.findOne({
          where: {
            follower: { id: adminId },
            following: { id: targetUserId },
          },
        });
        isFollowing = !!follow;
      }
      return { followersCount, followingCount, isFollowing };
    } catch (error) {
      console.log('Error in getFollowStats:', error);
      throw error;
    }
  }
}
