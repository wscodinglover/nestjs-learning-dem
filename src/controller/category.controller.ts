import { CategoryService } from '../service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Post } from '@nestjs/common';
import { CreateCategoryDto } from '../dto/category/index.dto';

@ApiTags('文章分类')
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}
  @ApiOperation({ summary: '创建分类' })
  @Post()
  async create(@Body() body: CreateCategoryDto) {
    return await this.categoryService.create(body.name);
  }
}
