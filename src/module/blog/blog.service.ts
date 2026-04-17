import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Blog } from './entity/blog.entity';
import { Repository, IsNull } from 'typeorm';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { Like } from 'typeorm';
import { statusbar } from '../../shared/constants/enum';

import { AIService } from '../ai/ai.service';
import { NotificationService } from '../notifications/notifications.service';

@Injectable()
export class BlogService {
  constructor(
    @InjectRepository(Blog)
    private readonly blogRepository: Repository<Blog>,
    private readonly aiService: AIService,
    private readonly notificationService: NotificationService,
  ) {}

  async create(createBlogDto: CreateBlogDto): Promise<Blog> {
    if (!createBlogDto.slug) {
      createBlogDto.slug = this.aiService.generateSlug(createBlogDto.title);
    }
    const { category_id, ...blogData } = createBlogDto;

    const blog = this.blogRepository.create({
      ...blogData,
      category: category_id ? { id: category_id } : undefined,
    });

    const savedBlog = await this.blogRepository.save(blog);

    if (savedBlog.status === statusbar.PUBLISHED) {
      await this.notificationService.notifyAllUsers(
        'New Blog Published',
        `Check out our new blog: ${savedBlog.title}`,
      );
    }

    return savedBlog;
  }

  async findByAuthor(
    authorId: string,
    options: {
      page: number;
      limit: number;
      search: string;
      category_id?: string;
    },
  ) {
    const { page, limit, search, category_id } = options;
    const skip = (page - 1) * limit;

    const [data, total] = await this.blogRepository.findAndCount({
      where: {
        author: { id: authorId },
        title: search ? Like(`%${search}%`) : undefined,
        category: category_id ? { id: category_id } : undefined,
      },
      relations: ['category'],
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
    category_id?: string;
  }): Promise<{
    data: Blog[];
    meta: { total: number; page: number; lastPage: number };
  }> {
    const { page, limit, search, category_id } = options;
    const skip = (page - 1) * limit;

    const query = this.blogRepository
      .createQueryBuilder('blog')
      .leftJoin('blog.author', 'author')
      .leftJoin('blog.category', 'category')
      .where('blog.deleted_at IS NULL')
      .andWhere('blog.status = :status', { status: statusbar.PUBLISHED });

    if (search) {
      query.andWhere('blog.title ILIKE :search', {
        search: `%${search}%`,
      });
    }

    if (category_id) {
      query.andWhere('category.id = :categoryId', {
        categoryId: category_id,
      });
    }

    query.select([
      'blog.id',
      'blog.title',
      'blog.content',
      'blog.slug',
      'blog.status',
      'blog.cover_image',
      'blog.created_at',
      'blog.updated_at',
      'author.id',
      'author.first_name',
      'author.last_name',
      'author.profile_picture',
      'category.id',
      'category.name',
    ]);

    query.orderBy('blog.created_at', 'DESC');

    query.skip(skip).take(limit);

    const [data, total] = await query.getManyAndCount();

    return {
      data,
      meta: {
        total,
        page,
        lastPage: Math.ceil(total / limit),
      },
    };
  }

  async findById(id: string): Promise<Blog | null> {
    const blog = await this.blogRepository
      .createQueryBuilder('blog')
      .leftJoin('blog.author', 'author')
      .leftJoin('blog.category', 'category')
      .where('blog.id = :id', { id })
      .andWhere('blog.deleted_at IS NULL')
      .select([
        'blog.id',
        'blog.title',
        'blog.content',
        'blog.slug',
        'blog.status',
        'blog.cover_image',
        'author.id',
        'author.first_name',
        'author.last_name',
        'author.profile_picture',
        'category.id',
        'category.name',
      ])
      .getOne();

    return blog || null;
  }

  async update(id: string, updateBlogDto: UpdateBlogDto): Promise<Blog | null> {
    const oldBlog = await this.blogRepository.findOne({ where: { id } });

    const { category_id, ...blogData } = updateBlogDto;

    // Use preload to handle relationship updates safely with types
    const blogToUpdate = await this.blogRepository.preload({
      id,
      ...blogData,
      category: category_id ? { id: category_id } : undefined,
    });

    if (blogToUpdate) {
      await this.blogRepository.save(blogToUpdate);
    }

    const updatedBlog = await this.findById(id);

    if (
      updatedBlog &&
      oldBlog &&
      oldBlog.status !== statusbar.PUBLISHED &&
      updatedBlog.status === statusbar.PUBLISHED
    ) {
      await this.notificationService.notifyAllUsers(
        'New Blog Published',
        `Check out our new blog: ${updatedBlog.title}`,
      );
    }

    return updatedBlog;
  }

  async softDelete(id: string): Promise<void> {
    await this.blogRepository.softDelete(id);
  }

  async findPublishedByAuthor(
    authorId: string,
    options: {
      page: number;
      limit: number;
      search: string;
      category_id?: string;
    },
  ) {
    const { page, limit, search, category_id } = options;
    const skip = (page - 1) * limit;

    const [data, total] = await this.blogRepository.findAndCount({
      where: {
        author: { id: authorId },
        title: search ? Like(`%${search}%`) : undefined,
        category: category_id ? { id: category_id } : undefined,
        status: statusbar.PUBLISHED,
        deleted_at: IsNull(),
      },
      relations: ['category'],
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

  async findByCategory(categoryId: string): Promise<Blog[]> {
    return this.blogRepository
      .createQueryBuilder('blog')
      .leftJoinAndSelect('blog.author', 'author')
      .leftJoinAndSelect('blog.category', 'category')
      .where('category.id = :categoryId', { categoryId })
      .andWhere('blog.deleted_at IS NULL')
      .select([
        'blog.id',
        'blog.title',
        'blog.content',
        'blog.slug',
        'blog.status',
        'blog.cover_image',
        'category.id',
        'category.name',
        'author.id',
        'author.first_name',
        'author.last_name',
        'author.profile_picture',
      ])
      .getMany();
  }
}
