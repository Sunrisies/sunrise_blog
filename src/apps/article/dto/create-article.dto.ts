import { IsString, IsNotEmpty, IsNumber, IsBoolean, IsArray, IsOptional, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';
export class CreateArticleDto {
    @IsString({ message: '文章标题必须是字符串类型' })
    @IsNotEmpty({ message: '文章标题不能为空' })
    @MaxLength(50, { message: '文章标题不能超过50个字符' })
    title: string; // 文章标题

    @IsString({ message: '文章内容必须是字符串类型' })
    @IsNotEmpty({ message: '文章内容不能为空' })
    content: string; // 文章内容

    @IsNumber({}, { message: '文章分类ID必须是数字类型' })
    @IsNotEmpty({ message: '文章分类ID不能为空' })
    categoryId: number; // 文章分类ID

    @IsArray()
    @IsNumber({}, { each: true })
    tagIds: number[]; // 文章标签ID数组



    @IsString({ message: '文章作者必须是字符串类型' })
    @MaxLength(50, { message: '文章作者不能超过50个字符' })
    author: string; //  文章作者

    @IsString({ message: '文章封面图片URL必须是字符串类型' })
    @MaxLength(255, { message: '文章封面图片URL不能超过255个字符' })
    @IsOptional()
    cover: string; // 文章封面图片URL

    @IsBoolean({ message: '是否置顶必须是布尔类型' })
    @IsOptional({ message: '是否置顶是可选的' })
    is_top?: boolean; // 是否置顶 ,默认false

    @IsBoolean({ message: '是否推荐必须是布尔类型' })
    @IsOptional()
    is_recommend?: boolean; // 是否推荐 默认false

    @IsBoolean({ message: '是否发布必须是布尔类型' })
    @IsOptional()
    is_publish?: boolean; // 是否发布 默认false

    @IsString({ message: '文章描述必须是字符串类型' })
    @MaxLength(255)
    description: string; // 文章描述 

    @IsNumber()
    @IsOptional()
    views?: number; // 文章浏览量 默认0

    @IsBoolean()
    @IsOptional()
    is_delete?: boolean; // 是否删除 默认false

    @IsBoolean()
    @IsOptional()
    is_hide?: boolean; // 是否隐藏 默认false

    @IsNumber()
    @IsOptional()
    size?: number; // 文章大小 默认0
}
