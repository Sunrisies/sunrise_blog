import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsEmail,
} from 'class-validator';

export class CreateMessageDto {
  @ApiProperty({ description: '留言内容', example: '这是一条留言' })
  @IsNotEmpty({ message: '留言内容不能为空' })
  @IsString({ message: '留言内容必须是字符串类型' })
  content: string;

  @ApiProperty({ description: '用户ID', example: 1 })
  @IsInt({ message: '用户ID必须是数字类型' })
  @IsOptional()
  userId?: number;

  @ApiProperty({ description: '父级留言ID', example: 1 })
  @IsInt({ message: '父级留言ID必须是数字类型' })
  @IsOptional()
  parentId?: number;

  @ApiProperty({ description: '用户昵称', example: '张三' })
  @IsOptional()
  @IsString()
  nickname?: string;

  @ApiProperty({ description: '用户头像', example: 'xxx.png' })
  @IsOptional()
  @IsEmail()
  email?: string;
}

export interface IMessage {
  id: number;
  content: string;
  created_at: string;
  nickname: string;
  avatar: string;
  email: string;
  replies: {
    id: number;
    content: string;
    created_at: string;
    nickname: string;
    avatar: string;
    email: string;
  }[];
}
