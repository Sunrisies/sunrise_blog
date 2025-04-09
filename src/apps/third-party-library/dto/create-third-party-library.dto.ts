import {
    IsNotEmpty, IsEnum, IsUrl, IsString, IsArray,
    IsOptional, MaxLength, IsNumber, IsObject
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateThirdPartyLibraryDto {
    @ApiProperty({ description: '库名称', example: 'Vue.js' })
    @IsNotEmpty({ message: '库名称不能为空' })
    @MaxLength(100, { message: '库名称不能超过100个字符' })
    name: string;

    @ApiProperty({ description: '官方网址', example: 'https://vuejs.org' })
    @IsUrl({}, { message: '请输入有效的URL地址' })
    @MaxLength(500, { message: 'URL长度不能超过250个字符' })
    officialUrl: string;

    @ApiProperty({ description: '描述', required: false, example: '渐进式JavaScript框架' })
    @IsOptional()
    @MaxLength(1000, { message: '描述不能超过1000个字符' })
    description?: string;

    @ApiProperty({ description: '元数据', required: false, type: Object })
    @IsOptional()
    @IsObject({ message: '元数据必须是有效的JSON对象' })
    metadata?: Record<string, any>;

    @ApiProperty({ description: '关联分类ID', example: 1, required: false })
    @IsOptional()
    @IsNumber({}, { message: '分类ID必须是数字' }) // 移除了each:true
    categoryId?: number; // 从数组改为单数字

    // 标签数组保持原样
    @ApiProperty({ description: '标签ID数组', example: [3, 4], required: false })
    @IsOptional()
    @IsArray({ message: '标签ID必须是数组格式' })
    @IsNumber({}, { each: true, message: '每个标签ID必须是数字' })
    tagIds?: number[];
}