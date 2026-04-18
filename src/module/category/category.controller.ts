import { Controller, Post, Body, Get } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Category } from './entity/category.entity';
// import { UseGuards } from '@nestjs/common';
// import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';
// import { RolesGuard } from '../../shared/guards/roles.guard';
// import { Roles } from '../../shared/decorators/roles.decorator';
// import { UserRole } from '../../shared/constants/enum';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  //create category
  @Post()
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles(UserRole.ADMIN)
  create(@Body() createCategoryDto: CreateCategoryDto): Promise<Category> {
    return this.categoryService.create(createCategoryDto.name);
  }

  //get all categories
  @Get()
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles(UserRole.ADMIN, UserRole.USER)
  findAll(): Promise<Category[]> {
    return this.categoryService.findAll();
  }
}
