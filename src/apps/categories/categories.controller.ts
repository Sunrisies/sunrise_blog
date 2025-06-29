import { PaginatedResponseDto, ResponseDto } from '@/types'
import { BadRequestException, Body, DefaultValuePipe, ParseIntPipe, Controller, Delete, Get, Param, ParseEnumPipe, Post, Put, Query } from '@nestjs/common'
import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger'
import { CategoriesService } from './categories.service'
import { CreateCategoryDto, ICategory } from './dto/create-category.dto'
import { UpdateCategoryDto } from './dto/update-category.dto'

@ApiTags('分类管理')
@ApiBearerAuth()
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) { }

  @ApiOperation({ summary: '添加分类' })
  @ApiOkResponse({
    description: '添加成功',
    type: ResponseDto<CreateCategoryDto>
  })
  @ApiBody({
    description: '分类信息',
    type: CreateCategoryDto
  })
  @Post()
  async create(@Body() createCategoryDto: CreateCategoryDto): Promise<ResponseDto<CreateCategoryDto>> {
    return await this.categoriesService.create(createCategoryDto)
  }

  @ApiOperation({ summary: '获取分类列表' })
  @ApiOkResponse({
    description: '获取成功',
    type: PaginatedResponseDto<ICategory>
  })
  @ApiQuery({
    name: 'type',
    description: '分类类型',
    enum: ['article', 'library'],
    required: false
  })
  @Get()
  async findAll(
    @Query(
      'type',
      new ParseEnumPipe(['article', 'library'], {
        optional: true, // 添加可选配置
        exceptionFactory: () => new BadRequestException('type参数必须是 article 或 library')
      })
    )
    type?: 'article' | 'library'
  ): Promise<PaginatedResponseDto<ICategory>> {
    return await this.categoriesService.findAll(type)
  }

  @ApiOperation({ summary: '修改分类' })
  @ApiOkResponse({ description: '修改成功', type: ResponseDto<null> })
  @ApiParam({
    name: 'id',
    description: '分类id',
    type: Number
  })
  @ApiBody({
    description: '分类信息',
    type: UpdateCategoryDto
  })
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto): Promise<ResponseDto<null>> {
    return await this.categoriesService.update(+id, updateCategoryDto)
  }

  @ApiOperation({ summary: '删除分类' })
  @ApiOkResponse({ description: '删除成功', type: ResponseDto<null> })
  @ApiParam({
    name: 'id',
    description: '分类id',
    type: Number
  })
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<ResponseDto<null>> {
    return await this.categoriesService.remove(+id)
  }

  // 获取分类列表带有分页功能的
  @ApiOperation({ summary: '获取分类列表' })
  @ApiOkResponse({ description: '获取成功', type: PaginatedResponseDto<ICategory> })
  @ApiQuery({
    name: 'type',
    description: '分类类型',
    enum: ['article', 'library'],
    required: false
  })
  @Get('list')
  async getCategoryList(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query(
      'type',
      new ParseEnumPipe(['article', 'library'], {
        optional: true, // 添加可选配置
        exceptionFactory: () => new BadRequestException('type参数必须是 article 或 library')
      }),

    )
    type?: 'article' | 'library',

  ): Promise<any> {
    return await this.categoriesService.getCategoryList({ type, page, limit })
  }
}
