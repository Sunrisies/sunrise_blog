import { IsNotEmpty, IsString, MaxLength } from "class-validator";
export class CreateTagDto {
    @IsString({ message: '标签名必须是字符串类型' })
    @IsNotEmpty({ message: '标签名不能为空' })
    @MaxLength(50, { message: '标签名不能超过50个字符' })
    name: string;
}
