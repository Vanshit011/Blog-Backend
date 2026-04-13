import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Blog } from './entity/blog.entity';
import { Repository, IsNull } from 'typeorm';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { Like } from 'typeorm';

import { AIService } from '../ai/ai.service';

@Injectable()
export class BlogService {
  constructor(
    @InjectRepository(Blog)
    private readonly blogRepository: Repository<Blog>,
    private readonly aiService: AIService,
  ) {}

  async create(createBlogDto: CreateBlogDto): Promise<Blog> {
    if (!createBlogDto.slug) {
      createBlogDto.slug = await this.aiService.generateSlug(
        createBlogDto.title,
      );
    }
    const blog = this.blogRepository.create(createBlogDto);
    return this.blogRepository.save(blog);
  }

  async findByAuthor(
    authorId: string,
    options: { page: number; limit: number; search: string },
  ) {
    const { page, limit, search } = options;
    const skip = (page - 1) * limit;

    const [data, total] = await this.blogRepository.findAndCount({
      where: {
        author: { id: authorId },
        title: search ? Like(`%${search}%`) : undefined,
      },
      order: {
        created_at: 'DESC',
      },
      take: limit,
      skip: skip,
    });

    return {
      data,
      meta: {
        total,
        page,
        lastPage: Math.ceil(total / limit),
      },
    };
  }

  async findAll(options: {
    page: number;
    limit: number;
    search: string;
  }): Promise<{
    data: Blog[];
    meta: { total: number; page: number; lastPage: number };
  }> {
    const { page, limit, search } = options;
    const skip = (page - 1) * limit;

    const [data, total] = await this.blogRepository.findAndCount({
      where: {
        title: search ? Like(`%${search}%`) : undefined,
        deleted_at: IsNull(),
        status: 'published',
      },
      relations: ['author'],
      select: {
        id: true,
        title: true,
        content: true,
        slug: true,
        status: true,
        coverImage: true,
        created_at: true,
        updated_at: true,
        author: {
          id: true,
          first_name: true,
          last_name: true,
        },
      },
      order: {
        created_at: 'DESC',
      },
      take: limit,
      skip: skip,
    });

    return {
      data: data,
      meta: { total: total, page, lastPage: Math.ceil(total / limit) },
    };
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
