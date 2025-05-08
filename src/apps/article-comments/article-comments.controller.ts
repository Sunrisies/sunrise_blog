import { Controller, Get, Post, Body, Patch, Param, Delete, Query, DefaultValuePipe, ParseIntPipe } from '@nestjs/common';
import { ArticleCommentsService } from './article-comments.service';
import { CreateArticleCommentDto } from './dto/create-article-comment.dto';
import { UpdateArticleCommentDto } from './dto/update-article-comment.dto';

@Controller('articleComments')
export class ArticleCommentsController {
  constructor(private readonly articleCommentsService: ArticleCommentsService) { }

  @Post()
  create(@Body() createArticleCommentDto: CreateArticleCommentDto) {
    return this.articleCommentsService.create(createArticleCommentDto);
  }
  @Get('admin')
  async findAllForAdmin(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number
  ) {
    return this.articleCommentsService.findAllForAdmin(page, limit);
  }
  @Get()
  findAll(@Query('articleId') articleId: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number) {
    return this.articleCommentsService.findAll(+articleId, page, limit);
  }
}
