import { IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {
    @IsString({ message: '用户名必须是字符串类型' })
    @IsNotEmpty({ message: '用户名不能为空' })
    @MaxLength(50, { message: '用户名不能超过50个字符' })
    user_name: string;

    @IsString({ message: '用户名必须是字符串类型' })
    @IsNotEmpty({ message: '用户名不能为空' })
    @MinLength(6, { message: '密码不能小于6位' })
    @MaxLength(24, { message: '密码不能超过24位' })
    pass_word: string;

    @IsString()
    @IsOptional()
    @MaxLength(255)
    image?: string;

    @IsString()
    @IsOptional()
    @MaxLength(20)
    phone?: string;

    @IsEmail()
    @IsOptional()
    @MaxLength(100)
    email?: string;
}
