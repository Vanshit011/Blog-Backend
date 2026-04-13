import { Controller, Get, UseGuards, Patch, Body, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';
import { GetUser } from 'src/shared/decorators/get-user.decorator';
import { User } from './entity/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { BlogService } from '../blog/blog.service';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly blogService: BlogService,
  ) {}

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getMyProfile(@GetUser() user: User) {
    return this.userService.findByIdOrUsername(user.id);
  }

  @Patch('profile/:id')
  @UseGuards(JwtAuthGuard)
  async updateProfile(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(id, updateUserDto);
  }

  //get author blogs
  @Get(':id/blogs')
  async getAuthorBlogs(@Param('id') id: string) {
    return this.blogService.findPublishedByAuthor(id, {
      page: 1,
      limit: 10,
      search: '',
    });
  }
}
