import {
  Controller,
  Post,
  Param,
  Delete,
  UseGuards,
  Get,
} from '@nestjs/common';
import { LikeService } from './like.service';
import { GetUser } from '../../shared/decorators/get-user.decorator';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';
import { RolesGuard } from '../../shared/guards/roles.guard';
import { Roles } from '../../shared/decorators/roles.decorator';
import { UserRole } from '../../shared/constants/enum';

@Controller('like')
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @Post(':blogId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.USER)
  async like(@Param('blogId') blogId: string, @GetUser('id') userId: string) {
    return this.likeService.like(userId, blogId);
  }

  @Get('/blog/:id/likes')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.USER)
  async getLikes(@Param('id') id: string, @GetUser('id') userId: string) {
    return this.likeService.getLikes(id, userId);
  }

  @Delete(':blogId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.USER)
  async unlike(@Param('blogId') blogId: string, @GetUser('id') userId: string) {
    return this.likeService.unlike(userId, blogId);
  }
}
