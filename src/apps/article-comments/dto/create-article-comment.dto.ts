import { IsInt, IsNotEmpty, IsOptional, IsString, IsEmail, IsBoolean } from 'class-validator';
export class CreateArticleCommentDto {
    @IsNotEmpty({ message: '评论内容不能为空' })
    @IsString({ message: '评论内容必须是字符串类型' })
    content: string;

    @IsInt({ message: '文章ID必须是数字类型' })
    articleId: number;

    @IsInt({ message: '用户ID必须是数字类型' })
    @IsOptional()
    userId?: number;

    @IsInt({ message: '父级评论ID必须是数字类型' })
    @IsOptional()
    parentId?: number;

    @IsOptional()
    @IsString()
    nickname?: string;

    @IsOptional()
    @IsEmail()
    email?: string;
}
