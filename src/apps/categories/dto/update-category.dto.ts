import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoryDto } from './create-category.dto';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {
  @IsString({ message: '分类名必须是字符串类型' })
  @IsNotEmpty({ message: '分类名不能为空' })
  @MaxLength(50, { message: '分类名不能超过50个字符' })
  @ApiProperty({
    description: '分类名',
    example: '分类名',
    maxLength: 50,
  })
  name: string;
}
