import {
  Controller,
  Post,
  Delete,
  Get,
  Param,
  UseGuards,
} from '@nestjs/common';
import { FollowService } from './follow.service';
import { GetUser } from '../../shared/decorators/get-user.decorator';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';
import { RolesGuard } from '../../shared/guards/roles.guard';
import { Roles } from '../../shared/decorators/roles.decorator';
import { UserRole } from '../../shared/constants/enum';

@Controller('follow')
export class FollowController {
  constructor(private readonly followService: FollowService) {}

  //user follow to author
  @Post(':authorId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.USER)
  async follow(
    @Param('authorId') authorId: string,
    @GetUser('id') userId: string,
  ) {
    return this.followService.follow(userId, authorId);
  }

  //user unfollow to author
  @Delete(':authorId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.USER)
  async unfollow(
    @Param('authorId') authorId: string,
    @GetUser('id') userId: string,
  ) {
    return this.followService.unfollow(userId, authorId);
  }

  // my followers list
  @Get('my/followers')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.USER)
  async getMyFollowers(@GetUser('id') userId: string) {
    return this.followService.getFollowers(userId);
  }

  // my following list
  @Get('my/following')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.USER)
  async getMyFollowing(@GetUser('id') userId: string) {
    return this.followService.getFollowing(userId);
  }

  // user follow stats
  @Get('stats/:authorId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.USER)
  async getFollowStats(
    @Param('authorId') authorId: string,
    @GetUser('id') userId: string,
  ) {
    return this.followService.getFollowStats(authorId, userId);
  }

  //admin

  @Post('admin/follow/:userId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async adminFollow(
    @Param('userId') userId: string,
    @GetUser('id') adminId: string,
  ) {
    return this.followService.adminFollow(userId, adminId);
  }

  @Delete('admin/unfollow/:userId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async adminUnfollow(
    @Param('userId') userId: string,
    @GetUser('id') adminId: string,
  ) {
    return this.followService.adminUnfollow(userId, adminId);
  }

  @Get('admin/my/followers')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async adminGetFollowers(@GetUser('id') adminId: string) {
    return this.followService.adminGetFollowers(adminId);
  }

  @Get('admin/my/following')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async adminGetFollowing(@GetUser('id') adminId: string) {
    return this.followService.adminGetFollowing(adminId);
  }

  @Get('admin/stats/:userId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async adminGetFollowStats(
    @Param('userId') userId: string,
    @GetUser('id') adminId: string,
  ) {
    return this.followService.adminGetFollowStats(userId, adminId);
  }
}
