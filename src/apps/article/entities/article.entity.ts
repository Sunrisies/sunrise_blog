import { ArticleComment } from '@/apps/article-comments/entities/article-comment.entity';
import { Category } from '@/apps/categories/entities/category.entity';
import { Tag } from '@/apps/tags/entities/tag.entity';
import { ApiProperty } from '@nestjs/swagger';
import {
  BeforeInsert,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
@Entity({ name: 'article' })
export class Article {
  @ApiProperty({ description: '文章ID', example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  // 添加一个uuid
  @ApiProperty({ description: '文章UUID', example: '3-a456-426614174000' })
  @Column({ type: 'uuid', unique: true })
  uuid: string;

  @BeforeInsert()
  generateUuid() {
    this.uuid = uuidv4();
  }

  @ApiProperty({
    description: '文章标题',
    example: '这是一篇文章',
    maxLength: 50,
  })
  @Column({ length: 50 })
  title: string;

  @ApiProperty({ description: '文章内容', example: '这是文章的详细内容...' })
  @Column('longtext')
  content: string;

  @ApiProperty({ description: '文章分类', type: () => Category })
  @ManyToOne(() => Category, (category) => category.articles)
  category: Category;

  @ApiProperty({ description: '文章标签', type: () => [Tag] })
  @ManyToMany(() => Tag, (tag) => tag.articles)
  @JoinTable({ name: 'article_tags' })
  tags: Tag[];

  @ApiProperty({
    description: '文章封面图片URL',
    example: 'https://example.com/cover.jpg',
    maxLength: 255,
  })
  @Column({ length: 255 })
  cover: string;

  @ApiProperty({ description: '作者名称', example: '张三', maxLength: 50 })
  @Column({ length: 50 })
  author: string;

  @ApiProperty({ description: '发布时间', example: '2023-01-01T00:00:00Z' })
  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  publish_time: Date;

  @ApiProperty({ description: '更新时间', example: '2023-01-01T00:00:00Z' })
  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  update_time: Date;

  @ApiProperty({ description: '文章浏览次数', example: 100, default: 0 })
  @Column({ default: 0 })
  views: number;

  @ApiProperty({ description: '是否置顶', example: false, default: false })
  @Column({ default: false })
  is_top: boolean;

  @ApiProperty({ description: '是否推荐', example: false, default: false })
  @Column({ default: false })
  is_recommend: boolean;

  @ApiProperty({ description: '是否删除', example: false, default: false })
  @Column({ default: false })
  is_delete: boolean;

  @ApiProperty({ description: '是否发布', example: true, default: false })
  @Column({ default: false })
  is_publish: boolean;

  @ApiProperty({ description: '是否隐藏', example: false, default: true })
  @Column({ default: true })
  is_hide: boolean;

  @ApiProperty({
    description: '文章描述',
    example: '这是文章的简要描述',
    maxLength: 255,
  })
  @Column({ length: 255 })
  description: string;

  @ApiProperty({ description: '文章大小（字节）', example: 1024, default: 0 })
  @Column({ default: 0 })
  size: number;

  @ApiProperty({ description: '文章评论', type: () => [ArticleComment] })
  @OneToMany(() => ArticleComment, (comment) => comment.article)
  comments: ArticleComment[];
}
