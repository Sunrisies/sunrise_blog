import { Controller, Get, Post, Body, Patch, Param, Delete, Put, Query, ParseEnumPipe, BadRequestException } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) { }

  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @Get()
  findAll(@Query('type', new ParseEnumPipe(['article', 'library'], {
    optional: true,// 添加可选配置
    exceptionFactory: () => new BadRequestException('type参数必须是 article 或 library')
  })) type?: 'article' | 'library') {
    return this.categoriesService.findAll(type);
  }

  @Put(":id")
  update(@Param("id") id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoriesService.update(+id, updateCategoryDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.categoriesService.remove(+id);
  }
}
