import { PaginatedResponseDto, ResponseDto } from '@/types';
import { Body, Controller, DefaultValuePipe, Delete, Get, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { Article } from './entities/article.entity';

@ApiTags('文章')
@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) { }
  // 时间轴
  @ApiOkResponse({ description: '获取成功', type: ResponseDto<Article> })
  @ApiOperation({ summary: '获取时间轴' })
  @Get("timeline")
  async getTimeline() {
    return this.articleService.getTimeline();
  }

  /**
 * 获取上一篇和下一篇
 * @param id 文章id
 * @returns 上一篇和下一篇
 */
  @ApiOkResponse({ description: '获取成功', type: CreateArticleDto })
  @ApiOperation({ summary: '获取上一篇和下一篇' })
  @Get("prevNext/:id")
  async getPrevNext(@Param("id") id: string) {
    return this.articleService.getPrevNext(+id);
  }


  @ApiOkResponse({ description: '添加成功', type: ResponseDto<Article> })
  @ApiOperation({ summary: '添加文档' })
  @Post()
  async create(@Body() createArticleDto: CreateArticleDto): Promise<ResponseDto<Article>> {
    const data = await this.articleService.create(createArticleDto);
    return data
  }

  @ApiOkResponse({ description: '获取成功', type: PaginatedResponseDto<Article> })
  @ApiOperation({ summary: '获取所有文档' })
  @Get()
  async findAllByPages(@Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number, @Query('category') category?: string,      // 新增分类筛选
    @Query('tag') tag?: string,               // 新增标签筛选
    @Query('title') title?: string            // 新增标题搜索
  ): Promise<PaginatedResponseDto<Article>> {
    return await this.articleService.findAll(page, limit, {
      category,
      tag,
      title
    });
  }

  // 获取所以文章的上传时间，根据上传时间排序
  @ApiOkResponse({ description: '获取成功', type: CreateArticleDto })
  @ApiOperation({ summary: '获取所有文章的上传时间，根据上传时间排序' })
  @Get("uploadTime")
  getUploadTime() {
    return this.articleService.getUploadTime();
  }

  @ApiOkResponse({ description: '获取成功', type: CreateArticleDto })
  @ApiOperation({ summary: '获取具体文章' })
  @Get(':id')
  findOne(@Param('id') id: string): Promise<ResponseDto<Article>> {
    return this.articleService.findOne(+id);
  }

  @ApiOkResponse({ description: '修改成功', type: CreateArticleDto })
  @ApiOperation({ summary: '修改文档' })
  @Put(':id')
  update(@Param('id') id: string, @Body() updateArticleDto: UpdateArticleDto) {
    return this.articleService.update(+id, updateArticleDto);
  }

  @ApiOkResponse({ description: '删除成功', type: ResponseDto<any> })
  @ApiOperation({ summary: '删除文档' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.articleService.remove(+id);
  }
}
