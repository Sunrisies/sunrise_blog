import { PartialType } from '@nestjs/mapped-types'
import { CreateTagDto } from './create-tag.dto'
import { IsNotEmpty, IsString, MaxLength } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class UpdateTagDto extends PartialType(CreateTagDto) {
  @IsString({ message: '标签名必须是字符串类型' })
  @IsNotEmpty({ message: '标签名不能为空' })
  @MaxLength(50, { message: '标签名不能超过50个字符' })
  @ApiProperty({
    description: '标签名',
    example: '标签名',
    required: true
  })
  name: string
}
