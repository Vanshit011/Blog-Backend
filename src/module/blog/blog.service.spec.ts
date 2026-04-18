import { Test, TestingModule } from '@nestjs/testing';
import { BlogService } from './blog.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Blog } from './entity/blog.entity';
import { AIService } from '../ai/ai.service';
import { NotificationService } from '../notifications/notifications.service';

const createQueryBuilderMock = (result: Blog[]) => {
  const queryBuilder = {
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    getMany: jest.fn().mockResolvedValue(result),
  };

  return queryBuilder;
};

describe('BlogService', () => {
  let service: BlogService;
  const repository = {
    createQueryBuilder: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BlogService,
        {
          provide: getRepositoryToken(Blog),
          useValue: repository,
        },
        {
          provide: AIService,
          useValue: {},
        },
        {
          provide: NotificationService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<BlogService>(BlogService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('returns category-based recommendations', async () => {
    const categoryBlogs = [{ id: '1' }, { id: '2' }] as Blog[];

    repository.createQueryBuilder.mockReturnValueOnce(
      createQueryBuilderMock(categoryBlogs),
    );

    const result = await service.getBlogRecommend('category-1');

    expect(result.map((blog) => blog.id)).toEqual(['1', '2']);
    expect(repository.createQueryBuilder).toHaveBeenCalledTimes(1);
  });

  it('returns an empty array when categoryId is missing', async () => {
    const result = await service.getBlogRecommend();

    expect(result).toEqual([]);
    expect(repository.createQueryBuilder).not.toHaveBeenCalled();
  });
});
