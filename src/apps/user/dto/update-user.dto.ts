import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEmail,
  MaxLength,
  MinLength,
  IsNumber,
} from 'class-validator';
export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  id: number;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  user_name?: string;

  @IsString()
  @IsOptional()
  @MinLength(6)
  @MaxLength(255)
  pass_word?: string;

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
