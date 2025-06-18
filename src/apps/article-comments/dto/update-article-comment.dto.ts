import { PartialType } from '@nestjs/mapped-types';
import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { CreateArticleCommentDto } from './create-article-comment.dto';

export class UpdateArticleCommentDto extends PartialType(
  CreateArticleCommentDto,
) {
  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsBoolean()
  isDeleted?: boolean;
}
