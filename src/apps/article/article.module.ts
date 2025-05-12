import { Module } from '@nestjs/common';
import { ArticleService } from './article.service';
import { ArticleController } from './article.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Article } from './entities/article.entity';
import { Tag } from '@/apps/tags/entities/tag.entity';
import { Category } from '@/apps/categories/entities/category.entity';
import { ApiTags } from '@nestjs/swagger';
@ApiTags('文章管理')
@Module({
  imports: [TypeOrmModule.forFeature([Article]), TypeOrmModule.forFeature([Category]), TypeOrmModule.forFeature([Tag])],
  controllers: [ArticleController],
  providers: [ArticleService],
  exports: [ArticleService]
})
export class ArticleModule { }
