import { ApiProperty } from '@nestjs/swagger'
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm'

@Entity()
export class Storage {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: '文件id', example: 1 })
  id: number

  @ApiProperty({ description: '文件路径', example: '/uploads/1234567890.png' })
  @Column({ length: 255 })
  path: string

  @ApiProperty({ description: '文件名称', example: '1234567890.png' })
  @Column({ length: 255, nullable: true })
  title?: string

  @ApiProperty({ description: '文件大小', example: '100KB' })
  @Column({ nullable: true })
  size?: string

  @ApiProperty({ description: '文件类型', example: 'image/png' })
  @Column({ length: 255, nullable: true })
  type?: string

  @ApiProperty({ description: '文件描述', example: '这是一个图片' })
  @CreateDateColumn({ type: 'datetime' })
  created_at: Date

  @ApiProperty({
    description: '存储提供商',
    example: 'qiniu',
    enum: ['local', 'aliyun', 'tencent', 'qiniu']
  })
  @Column({ length: 50, nullable: true }) // 假设最大长度为50，你可以根据实际情况调整
  storage_provider?: string
}
