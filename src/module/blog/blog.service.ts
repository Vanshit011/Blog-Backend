import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Blog } from './entity/blog.entity';
import { Repository, IsNull } from 'typeorm';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';

@Injectable()
export class BlogService {
  constructor(
    @InjectRepository(Blog)
    private readonly blogRepository: Repository<Blog>,
  ) {}

  async create(createBlogDto: CreateBlogDto): Promise<Blog> {
    const blog = this.blogRepository.create(createBlogDto);
    return this.blogRepository.save(blog);
  }

  async findById(id: string): Promise<Blog | null> {
    return this.blogRepository.findOne({ where: { id, deleted_at: IsNull() } });
  }

  async update(id: string, updateBlogDto: UpdateBlogDto): Promise<Blog | null> {
    await this.blogRepository.update(id, updateBlogDto);
    return this.findById(id);
  }

  async softDelete(id: string): Promise<void> {
    await this.blogRepository.softDelete(id);
  }
}
