import { Module } from '@nestjs/common';
import { ArticleCommentsService } from './article-comments.service';
import { ArticleCommentsController } from './article-comments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleComment } from '../article-comments/entities/article-comment.entity';
import { User } from '../user/entities/user.entity';
import { Article } from '../article/entities/article.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ArticleComment]), TypeOrmModule.forFeature([Article]), TypeOrmModule.forFeature([User])], // 导入 TypeOrmModule 并指定实体
  controllers: [ArticleCommentsController],
  providers: [ArticleCommentsService],
})
export class ArticleCommentsModule { }
