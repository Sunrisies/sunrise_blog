import { IsInt, IsNotEmpty, IsOptional, IsString, IsEmail } from 'class-validator';

export class CreateMessageDto {
    @IsNotEmpty({ message: '留言内容不能为空' })
    @IsString({ message: '留言内容必须是字符串类型' })
    content: string;

    @IsInt({ message: '用户ID必须是数字类型' })
    @IsOptional()
    userId?: number;

    @IsInt({ message: '父级留言ID必须是数字类型' })
    @IsOptional()
    parentId?: number;

    @IsOptional()
    @IsString()
    nickname?: string;

    @IsOptional()
    @IsEmail()
    email?: string;
}