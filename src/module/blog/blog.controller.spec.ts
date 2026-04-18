import { Test, TestingModule } from '@nestjs/testing';
import { BlogController } from './blog.controller';
import { BlogService } from './blog.service';
import { AIService } from '../ai/ai.service';

describe('BlogController', () => {
  let controller: BlogController;
  const blogService = {
    getBlogRecommend: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BlogController],
      providers: [
        {
          provide: BlogService,
          useValue: blogService,
        },
        {
          provide: AIService,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<BlogController>(BlogController);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('passes categoryId to the service', async () => {
    blogService.getBlogRecommend.mockResolvedValue([]);

    await controller.getBlogRecommend('cat-1');

    expect(blogService.getBlogRecommend).toHaveBeenCalledWith('cat-1');
  });
});
