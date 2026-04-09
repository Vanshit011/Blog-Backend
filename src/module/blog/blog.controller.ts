import {
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Body,
  Param,
  UseGuards,
  Query,
} from '@nestjs/common';
import { BlogService } from './blog.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';
import { RolesGuard } from '../../shared/guards/roles.guard';
import { Roles } from '../../shared/decorators/roles.decorator';
import { UserRole } from '../../shared/constants/enum';
import { GetUser } from '../../shared/decorators/get-user.decorator';
import { AdminBlogQueryParams } from '../../shared/constants/types';
@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  //create blog
  @Post('create')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async createBlog(
    @GetUser('id') author_id: string,
    @Body() createBlogDto: CreateBlogDto,
  ) {
    createBlogDto.author = { id: author_id };
    return this.blogService.create(createBlogDto);
  }

  //get my-blog
  @Get('my-blogs')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async getMyBlogs(
    @GetUser('id') author_id: string,
    @Query() query: AdminBlogQueryParams,
  ) {
    return this.blogService.findByAuthor(author_id, query);
  }

  //get all blogs
  @Get('all')
  async getAllBlogs(@Query() query: AdminBlogQueryParams) {
    return this.blogService.findAll(query);
  }

  //get blog by id
  @Get(':id')
  async getBlogById(@Param('id') id: string) {
    return this.blogService.findById(id);
  }

  //update blog
  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async updateBlog(
    @Param('id') id: string,
    @Body() updateBlogDto: UpdateBlogDto,
  ) {
    return this.blogService.update(id, updateBlogDto);
  }

  //soft delete blog
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async deleteBlog(@Param('id') id: string) {
    return this.blogService.softDelete(id);
  }
}
