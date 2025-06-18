import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ArticleCommentsService } from './article-comments.service';
import { CreateArticleCommentDto } from './dto/create-article-comment.dto';
@ApiTags('文章评论')
@Controller('articleComments')
export class ArticleCommentsController {
  constructor(
    private readonly articleCommentsService: ArticleCommentsService,
  ) {}

  @ApiOkResponse({ description: '添加评论成功' })
  @ApiOperation({ summary: '添加评论' })
  @Post()
  create(@Body() createArticleCommentDto: CreateArticleCommentDto) {
    return this.articleCommentsService.create(createArticleCommentDto);
  }

  @ApiOkResponse({ description: '获取所有文章评论' })
  @ApiOperation({ summary: '获取所有文章评论' })
  @Get('admin')
  async findAllForAdmin(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return this.articleCommentsService.findAllForAdmin(page, limit);
  }

  @ApiOkResponse({ description: '获取文章评论' })
  @ApiOperation({ summary: '根据文章id获取评论' })
  @Get()
  findAll(
    @Query('articleId') articleId: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return this.articleCommentsService.findAll(+articleId, page, limit);
  }
}
