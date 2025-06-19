import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator'
import { UserRole } from '../entities/user.entity'

export class CreateUserDto {
  @IsString({ message: '用户名必须是字符串类型' })
  @IsNotEmpty({ message: '用户名不能为空' })
  @MaxLength(50, { message: '用户名不能超过50个字符' })
  @ApiProperty({ description: '用户名', example: 'john_doe', maxLength: 50 })
  user_name: string

  @IsString({ message: '用户名必须是字符串类型' })
  @IsNotEmpty({ message: '用户名不能为空' })
  @MinLength(6, { message: '密码不能小于6位' })
  @MaxLength(24, { message: '密码不能超过24位' })
  @ApiProperty({ description: '密码', minLength: 6, maxLength: 255 })
  pass_word: string

  @IsString()
  @IsOptional()
  @MaxLength(255)
  @ApiProperty({
    description: '用户头像URL',
    required: false,
    example: 'https://example.com/avatar.jpg'
  })
  image?: string

  @IsString()
  @IsOptional()
  @MaxLength(20)
  @ApiProperty({
    description: '手机号码',
    required: false,
    example: '13800138000'
  })
  phone?: string

  @IsEmail()
  @IsOptional()
  @MaxLength(100)
  @ApiProperty({
    description: '电子邮箱',
    format: 'email',
    example: 'user@example.com',
    required: false
  })
  email?: string

  @ApiProperty({
    description: '用户角色',
    enum: UserRole,
    default: UserRole.USER
  })
  @IsOptional()
  role?: UserRole = UserRole.USER
}
