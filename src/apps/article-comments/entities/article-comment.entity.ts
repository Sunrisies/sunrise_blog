import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm'
import { Article } from '@/apps/article/entities/article.entity'
import { User } from '@/apps/user/entities/user.entity'
import { ApiProperty } from '@nestjs/swagger'

@Entity({ name: 'article_comment' })
export class ArticleComment {
  @ApiProperty({ description: '评论ID' })
  @PrimaryGeneratedColumn()
  id: number // 评论ID

  @ApiProperty({ description: '评论内容' })
  @Column('text')
  content: string // 评论内容

  @ApiProperty({ description: '评论的文章ID' })
  @ManyToOne(() => Article, (article) => article.comments)
  article: Article // 关联的文章

  @ApiProperty({ description: '评论的用户ID' })
  @ManyToOne(() => User, (user) => user.comments)
  user: User // 关联的用户

  @ApiProperty({ description: '父评论ID' })
  @ManyToOne(() => ArticleComment, (comment) => comment.replies)
  parent: ArticleComment // 关联的父评论

  @ApiProperty({ description: '子评论列表' })
  @OneToMany(() => ArticleComment, (comment) => comment.parent)
  replies: ArticleComment[] // 关联的子评论

  @ApiProperty({ description: '评论创建时间' })
  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date // 评论创建时间

  @ApiProperty({ description: '评论更新时间' })
  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date // 评论更新时间

  @ApiProperty({ description: '是否删除' })
  @Column({ default: false })
  isDeleted: boolean // 是否删除

  @ApiProperty({ description: '昵称' })
  @Column({ nullable: true })
  nickname: string // 昵称

  @ApiProperty({ description: '邮箱' })
  @Column({ nullable: true })
  email: string // 邮箱
}
