import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";
export class CreateTagDto {
    @IsString({ message: '标签名必须是字符串类型' })
    @IsNotEmpty({ message: '标签名不能为空' })
    @MaxLength(50, { message: '标签名不能超过50个字符' })
    name: string;


    @IsOptional()
    @IsEnum(['article', 'library'], {
        message: '类型必须是 article 或 library'
    })
    @ApiProperty({
        enum: ['article', 'library'],
        default: 'article',
        required: false
    })
    type: string = 'article';
}
