import { Controller, Get, Post, Body, Patch, Param, Delete, Query, DefaultValuePipe, ParseIntPipe, Put } from '@nestjs/common';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';

@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) { }
  /**
 * 获取上一篇和下一篇
 * @param id 文章id
 * @returns 上一篇和下一篇
 */
  @Get("prevNext/:id")
  async getPrevNext(@Param("id") id: string) {
    return this.articleService.getPrevNext(+id);
  }


  @Post()
  async create(@Body() createArticleDto: CreateArticleDto) {
    const data = await this.articleService.create(createArticleDto);
    console.log(data);
    return data
  }

  @Get()
  async findAllByPages(@Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number, @Query('category') category?: string,      // 新增分类筛选
    @Query('tag') tag?: string,               // 新增标签筛选
    @Query('title') title?: string            // 新增标题搜索
  ) {
    return await this.articleService.findAll(page, limit, {
      category,
      tag,
      title
    });
  }

  // 获取所以文章的上传时间，根据上传时间排序
  @Get("uploadTime")
  getUploadTime() {
    return this.articleService.getUploadTime();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.articleService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateArticleDto: UpdateArticleDto) {
    return this.articleService.update(+id, updateArticleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.articleService.remove(+id);
  }
}
