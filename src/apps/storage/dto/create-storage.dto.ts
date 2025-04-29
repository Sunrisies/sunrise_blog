import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
export enum StorageProvider {
  QINIU = 'qiniu',
  ALIYUN = 'aliyun'
}
export class CreateStorageDto {
  @ApiProperty({ description: '文件存储路径' })
  @IsNotEmpty()
  @IsString()
  path: string;

  @ApiProperty({ required: false, description: '文件标题' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ required: false, description: '文件大小' })
  @IsOptional()
  @IsString()
  size?: string;

  @ApiProperty({ required: false, description: '文件MIME类型' })
  @IsOptional()
  @IsString()
  type?: string;

  @ApiProperty({ required: false, description: '云存储提供商', enum: StorageProvider, example: StorageProvider.QINIU })
  @IsOptional()
  @IsString()
  storage_provider?: StorageProvider;
}

