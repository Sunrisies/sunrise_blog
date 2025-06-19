import { ApiProperty } from '@nestjs/swagger'
import { IsISO8601, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator'

export class CreateVisitLogDto {
  @IsString()
  @IsOptional()
  @ApiProperty({ description: '访问IP', required: false })
  ip: string | null

  @IsString()
  @IsOptional()
  @ApiProperty({ description: '用户代理', required: false })
  userAgent: string | null

  @IsString()
  @IsOptional()
  @ApiProperty({ description: '来源页面', required: false })
  referer: string | null

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: '访问URL' })
  url: string

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: '请求方法' })
  method: string

  @IsISO8601()
  @IsNotEmpty()
  @ApiProperty({ description: '访问时间' })
  timestamp: string

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: '浏览器名称' })
  browserName: string

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: '浏览器版本' })
  browserVersion: string

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: '浏览器主版本' })
  browserMajor: string

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: '设备类型' })
  deviceType: string

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: '设备型号' })
  deviceModel: string

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: '设备厂商' })
  deviceVendor: string

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: '操作系统名称' })
  osName: string

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: '操作系统版本' })
  osVersion: string

  @IsString()
  @IsOptional()
  @ApiProperty({ description: '国家', required: false })
  country?: string

  @IsString()
  @IsOptional()
  @ApiProperty({ description: '地区', required: false })
  region?: string

  @IsString()
  @IsOptional()
  @ApiProperty({ description: '城市', required: false })
  city?: string

  @IsNumber()
  @IsOptional()
  @ApiProperty({ description: '加载时间', required: false })
  loadTime?: number

  @IsNumber()
  @IsOptional()
  @ApiProperty({ description: 'DOM准备时间', required: false })
  domReady?: number

  @IsNumber()
  @IsOptional()
  @ApiProperty({ description: '首次绘制时间', required: false })
  firstPaint?: number
}
