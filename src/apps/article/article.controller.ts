import { Body, Controller, DefaultValuePipe ,Delete, Get, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common'
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import { ArticleService } from './article.service'
import { CreateArticleDto } from './dto/create-article.dto'
import { UpdateArticleDto } from './dto/update-article.dto'

/**
 * 文章控制器
 * 处理所有与文章相关的HTTP请求
 */
@ApiTags('文章')
@ApiBearerAuth()
@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  /**
   * 获取文章时间轴
   * @description 获取所有文章按时间排序的列表，用于展示文章时间轴
   * @requires Permission.ALL 需要管理员权限
   * @returns 返回按时间排序的文章列表
   */
  @ApiOperation({ summary: '获取时间轴' })
  @ApiOkResponse({ description: '获取时间轴成功' })
  @Get('timeline')
  async getTimeline() {
    return this.articleService.getTimeline()
  }

  /**
   * 获取指定文章的上一篇和下一篇文章
   * @description 根据当前文章ID获取相邻的文章信息，用于文章导航
   * @param id 当前文章的ID
   * @returns 返回包含上一篇和下一篇文章信息的对象
   */
  @ApiOkResponse({ description: '获取上一篇和下一篇成功' })
  @ApiOperation({ summary: '获取上一篇和下一篇' })
  @Get('prevNext/:id')
  async getPrevNext(@Param('id') id: string) {
    return this.articleService.getPrevNext(id)
  }

  /**
   * 创建新文章
   * @description 创建并保存新的文章
   * @param createArticleDto 创建文章的数据传输对象，包含文章的所有必要信息
   * @returns 返回创建成功的文章信息
   */
  @ApiOperation({ summary: '创建新文章' })
  @ApiOkResponse({ description: '创建文章成功' })
  @Post()
  async create(@Body() createArticleDto: CreateArticleDto) {
    const data = await this.articleService.create(createArticleDto)
    return data
  }

  /**
   * 分页获取文章列表
   * @description 支持分页、分类、标签和标题搜索的文章列表查询
   * @param page 当前页码，默认为1
   * @param limit 每页显示数量，默认为10
   * @param category 可选的分类筛选
   * @param tag 可选的标签筛选
   * @param title 可选的标题搜索关键词
   * @returns 返回分页的文章列表数据
   */
  @ApiOperation({ summary: '获取文章列表' })
  @ApiOkResponse({ description: '获取文章列表成功' })
  @Get()
  async findAllByPages(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('category') category?: string,
    @Query('tag') tag?: string,
    @Query('title') title?: string
  ) {
    return await this.articleService.findAll(page, limit, {
      category,
      tag,
      title
    })
  }

  /**
   * 获取文章上传时间列表
   * @description 获取所有文章的上传时间，并按时间排序
   * @returns 返回排序后的文章上传时间列表
   */
  @ApiOperation({ summary: '获取文章上传时间列表' })
  @ApiOkResponse({ description: '获取文章上传时间列表成功' })
  @Get('uploadTime')
  getUploadTime() {
    return this.articleService.getUploadTime()
  }

  /**
   * 获取单篇文章详情
   * @description 根据文章ID获取文章的详细信息
   * @param id 文章ID
   * @returns 返回文章的详细信息
   */
  @ApiOperation({ summary: '获取文章详情' })
  @ApiOkResponse({ description: '获取文章详情成功' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.articleService.findOne(id)
  }

  /**
   * 更新文章信息
   * @description 根据文章ID更新文章的信息
   * @param id 要更新的文章ID
   * @param updateArticleDto 更新文章的数据传输对象
   * @returns 返回更新后的文章信息
   */
  @ApiOperation({ summary: '更新文章' })
  @ApiOkResponse({ description: '更新文章成功' })
  @Put(':id')
  update(@Param('id') id: string, @Body() updateArticleDto: UpdateArticleDto) {
    return this.articleService.update(id, updateArticleDto)
  }

  /**
   * 删除文章
   * @description 根据文章ID删除指定文章
   * @param id 要删除的文章ID
   * @returns 返回删除操作的结果
   */
  @ApiOperation({ summary: '删除文章' })
  @ApiOkResponse({ description: '删除文章成功' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.articleService.remove(id)
  }
}
