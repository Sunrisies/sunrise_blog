import { Module } from '@nestjs/common';
import { ArticleService } from './article.service';
import { ArticleController } from './article.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Article } from './entities/article.entity';
import { Tag } from '../tags/entities/tag.entity';
import { Category } from '../categories/entities/category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Article]), TypeOrmModule.forFeature([Category]), TypeOrmModule.forFeature([Tag])],
  controllers: [ArticleController],
  providers: [ArticleService],
})
export class ArticleModule { }
