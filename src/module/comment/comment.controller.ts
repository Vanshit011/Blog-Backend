import {
  Controller,
  Post,
  Param,
  Delete,
  UseGuards,
  Body,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { GetUser } from '../../shared/decorators/get-user.decorator';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';
import { RolesGuard } from '../../shared/guards/roles.guard';
import { Roles } from '../../shared/decorators/roles.decorator';
import { UserRole } from '../../shared/constants/enum';
import { CreateCommentDto } from './dto/create-comment.dto';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post(':blogId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.USER)
  async addComment(
    @Param('blogId') blogId: string,
    @GetUser('id') userId: string,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    return this.commentService.addComment(
      userId,
      blogId,
      createCommentDto.content,
    );
  }

  @Delete(':commentId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.USER)
  async deleteComment(
    @Param('commentId') commentId: string,
    @GetUser('id') userId: string,
  ) {
    return this.commentService.deleteComment(userId, commentId);
  }
}
