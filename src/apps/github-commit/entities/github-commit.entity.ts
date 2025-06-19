import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm'
import { ApiProperty } from '@nestjs/swagger'

@Entity('github_commits')
export class GithubCommit {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: '主键ID' })
  id: number

  @Column({ length: 40 })
  @ApiProperty({ description: '提交SHA值' })
  sha: string

  @Column({ length: 100 })
  @ApiProperty({ description: '节点ID' })
  node_id: string

  @Column({ length: 100 })
  @ApiProperty({ description: '仓库拥有者' })
  author_name: string

  @Column({ length: 100 })
  @ApiProperty({ description: '作者邮箱' })
  author_email: string

  @Column('datetime')
  @ApiProperty({ description: '提交时间' })
  commit_date: Date

  @Column('text')
  @ApiProperty({ description: '提交消息' })
  message: string

  @Column({ length: 40 })
  @ApiProperty({ description: '树SHA值' })
  tree_sha: string

  @Column({ length: 255 })
  @ApiProperty({ description: '提交URL' })
  url: string

  @Column({ length: 255 })
  @ApiProperty({ description: 'HTML页面URL' })
  html_url: string

  @Column({ length: 255 })
  @ApiProperty({ description: '评论URL' })
  comments_url: string

  @Column({ default: 0 })
  @ApiProperty({ description: '评论数量' })
  comment_count: number

  @Column({ length: 100, nullable: true })
  @ApiProperty({ description: '父提交SHA值' })
  parent_sha: string

  @Column({ length: 255, nullable: true })
  @ApiProperty({ description: '父提交URL' })
  parent_url: string

  @Column({ default: true })
  @ApiProperty({ description: '验证状态' })
  verified: boolean

  @Column({ length: 50, nullable: true })
  @ApiProperty({ description: '验证原因' })
  verify_reason: string

  @CreateDateColumn()
  @ApiProperty({ description: '记录创建时间' })
  created_at: Date

  @Column({ length: 100 })
  @ApiProperty({ description: '仓库名称' })
  repository: string

  @Column({ length: 100 })
  @ApiProperty({ description: '分支名称' })
  branch: string
}
