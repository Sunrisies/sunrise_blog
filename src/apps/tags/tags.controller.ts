import { JwtGuard } from '@/guard/jwt.guard'
import { PaginatedResponseDto, ResponseDto } from '@/types'
import {
  DefaultValuePipe,
  ParseIntPipe,
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseEnumPipe,
  Post,
  Put,
  Query,
  UseGuards
} from '@nestjs/common'
import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger'
import { CreateTagDto, ITag } from './dto/create-tag.dto'
import { UpdateTagDto } from './dto/update-tag.dto'
import { TagsService } from './tags.service'
@ApiTags('标签管理')
@ApiBearerAuth()
@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) { }

  @Post()
  @ApiOperation({ summary: '添加标签' })
  @ApiOkResponse({ description: '添加成功', type: ResponseDto<CreateTagDto> })
  @ApiBody({
    description: '标签信息',
    type: CreateTagDto
  })
  async create(@Body() createTagDto: CreateTagDto): Promise<ResponseDto<CreateTagDto>> {
    return await this.tagsService.create(createTagDto)
  }

  @ApiOperation({ summary: '获取标签列表' })
  @ApiOkResponse({ description: '获取成功', type: ResponseDto<CreateTagDto[]> })
  @ApiQuery({
    name: 'type',
    description: '标签类型',
    required: false,
    enum: ['article', 'library']
  })
  @UseGuards(JwtGuard)
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
  ): Promise<PaginatedResponseDto<ITag>> {
    return await this.tagsService.findAll(type)
  }

  @ApiOperation({ summary: '更新标签' })
  @ApiOkResponse({ description: '更新成功', type: ResponseDto<CreateTagDto> })
  @ApiParam({ name: 'id', description: '标签ID', required: true })
  @ApiBody({
    description: '标签信息',
    type: UpdateTagDto
  })
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateTagDto: UpdateTagDto): Promise<ResponseDto<null>> {
    return await this.tagsService.update(+id, updateTagDto)
  }

  @ApiOperation({ summary: '删除标签' })
  @ApiOkResponse({ description: '删除成功', type: ResponseDto<CreateTagDto> })
  @ApiParam({ name: 'id', description: '标签ID', required: true })
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<ResponseDto<null>> {
    return await this.tagsService.remove(+id)
  }

  // 获取标签列表带有分页功能的
  @ApiOperation({ summary: '获取标签列表' })
  @ApiOkResponse({ description: '获取成功', type: PaginatedResponseDto<ITag> })
  @ApiQuery({
    name: 'type',
    description: '标签类型',
    required: false,
    enum: ['article', 'library']
  })
  @Get("list")
  async getTagList(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query(
      'type',
      new ParseEnumPipe(['article', 'library'], {
        optional: true, // 添加可选配置
        exceptionFactory: () => new BadRequestException('type参数必须是 article 或 library')
      })
    )
    type?: 'article' | 'library'
  ): Promise<any> {
    return await this.tagsService.getTagList({page, limit, type})
  }
}
