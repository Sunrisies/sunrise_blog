import { IsNotEmpty, IsString, IsBoolean, IsOptional, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateGithubRepositoryDto {
    @ApiProperty({ description: '仓库拥有者' })
    @IsNotEmpty({ message: '仓库拥有者不能为空' })
    @IsString({ message: '仓库拥有者必须是字符串类型' })
    owner: string;

    @ApiProperty({ description: '仓库名称' })
    @IsNotEmpty({ message: '仓库名称不能为空' })
    @IsString({ message: '仓库名称必须是字符串类型' })
    repository: string;

    @ApiProperty({ description: '分支名称' })
    @IsNotEmpty({ message: '分支名称不能为空' })
    @IsString({ message: '分支名称必须是字符串类型' })
    branch: string;

    @ApiProperty({ description: '是否启用', default: true })
    @IsOptional()
    @IsBoolean({ message: '是否启用必须是布尔类型' })
    enabled?: boolean;
}