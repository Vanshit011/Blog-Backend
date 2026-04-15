import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Follow } from './entity/follow.entity';
import { User } from '../user/entity/user.entity';

@Injectable()
export class FollowService {
  constructor(
    @InjectRepository(Follow)
    private readonly followRepository: Repository<Follow>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async follow(followerId: string, followingId: string) {
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
    await this.followRepository.save(follow);

    return { message: 'User followed successfully' };
  }

  async unfollow(followerId: string, followingId: string) {
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

    return { message: 'User unfollowed successfully' };
  }

  async getFollowers(userId: string) {
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
          username: true,
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
        username: f.follower.username,
        followed_at: f.created_at,
      })),
    };
  }

  async getFollowing(userId: string) {
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
          username: true,
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
        username: f.following.username,
        followed_at: f.created_at,
      })),
    };
  }

  async getFollowStats(userId: string, currentUserId?: string) {
    const followersCount = await this.followRepository.count({
      where: { following: { id: userId } },
    });

    const followingCount = await this.followRepository.count({
      where: { follower: { id: userId } },
    });

    let isFollowing = false;
    if (currentUserId && currentUserId !== userId) {
      const follow = await this.followRepository.findOne({
        where: {
          follower: { id: currentUserId },
          following: { id: userId },
        },
      });
      isFollowing = !!follow;
    }

    return { followersCount, followingCount, isFollowing };
  }
}
