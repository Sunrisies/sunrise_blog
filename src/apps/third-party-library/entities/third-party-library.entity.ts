import { Category } from '@/apps/categories/entities/category.entity'
import { Tag } from '@/apps/tags/entities/tag.entity'
import { ApiProperty } from '@nestjs/swagger'
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
@Entity({ name: 'third_party_libraries' })
export class ThirdPartyLibrary {
  @ApiProperty({ description: '主键ID', example: 1 })
  @PrimaryGeneratedColumn()
  id: number // 主键ID

  @ApiProperty({ description: '库名称', example: 'lodash' })
  @Column({ length: 100 })
  name: string // 库名称

  @ApiProperty({ description: '库的标签', example: [1, 2] })
  // 在类中添加标签关联
  @ManyToMany(() => Tag)
  @JoinTable({
    name: 'library_tags',
    joinColumn: { name: 'library_id' },
    inverseJoinColumn: { name: 'tag_id' }
  })
  tags: Tag[] // 标签ID数组

  @ApiProperty({ description: '库的url', example: 'http://xxx.com' })
  @Column({ length: 250, name: 'official_url' })
  officialUrl: string // 官方文档URL

  @ApiProperty({ description: '库的描述', example: 'js' })
  @Column({ type: 'text', nullable: true })
  description: string // 描述

  @ApiProperty({ description: '库的元数据', example: {} })
  @Column({ type: 'json', nullable: true })
  metadata: Record<string, any> // 元数据 JSON 格式

  @ApiProperty({ description: '库的分类', example: 1 })
  @ManyToOne(() => Category)
  @JoinColumn({ name: 'category_id' })
  category: Category // 单个分类关联

  @ApiProperty({ description: '库的创建时间', example: '2023-01-01 00:00:00' })
  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date

  @ApiProperty({ description: '库的更新时间', example: '2023-01-01 00:00:00' })
  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date
}
