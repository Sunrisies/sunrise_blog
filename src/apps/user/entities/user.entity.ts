import { Entity, PrimaryGeneratedColumn, Column, OneToMany, Generated } from 'typeorm'
import { ArticleComment } from '@/apps/article-comments/entities/article-comment.entity'
import { ApiProperty } from '@nestjs/swagger'
import { Message } from '@/apps/message/entities/message.entity'

// 定义用户角色枚举
export enum UserRole {
  ADMIN = 'admin',
  EDITOR = 'editor',
  USER = 'user',
  GUEST = 'guest'
}

// 使用二进制定义权限
export enum Permission {
  NONE = 0, // 0000 0000
  READ_ARTICLE = 1 << 0, // 0000 0001  文章读取权限
  WRITE_ARTICLE = 1 << 1, // 0000 0010  文章写入权限
  DELETE_ARTICLE = 1 << 2, // 0000 0100  文章删除权限
  MANAGE_COMMENT = 1 << 3, // 0000 1000  评论管理权限
  MANAGE_USER = 1 << 4, // 0001 0000  用户管理权限
  MANAGE_SYSTEM = 1 << 5, // 0010 0000  系统管理权限
  MANAGE_FILE = 1 << 6, // 0100 0000  文件管理权限
  // 新增权限示例
  MANAGE_TAG = 1 << 7, // 1000 0000  标签管理权限
  MANAGE_CATEGORY = 1 << 8, // 0001 0000 0000  分类管理权限
  MANAGE_MESSAGE = 1 << 9, // 0010 0000 0000  留言管理权限

  // 更新 ALL 权限
  ALL = 0xfff // 1111 1111 1111  所有权限（12位）
}

// 预定义角色权限
export const RolePermissions = {
  [UserRole.ADMIN]: Permission.ALL,
  [UserRole.EDITOR]: Permission.READ_ARTICLE | Permission.WRITE_ARTICLE | Permission.DELETE_ARTICLE | Permission.MANAGE_COMMENT,
  [UserRole.USER]: Permission.READ_ARTICLE | Permission.WRITE_ARTICLE | Permission.MANAGE_COMMENT | Permission.MANAGE_MESSAGE,
  [UserRole.GUEST]: Permission.READ_ARTICLE
}

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: '用户ID', example: 1 })
  id: number

  @Column({ unique: true })
  @Generated('uuid')
  public_id: string // 对外暴露（UUID）

  @Column({ length: 50, unique: true })
  @ApiProperty({ description: '用户名', example: 'john_doe', maxLength: 50 })
  user_name: string

  @Column({ length: 255 })
  @ApiProperty({ description: '加密后的密码', minLength: 6, maxLength: 255 })
  pass_word: string

  @Column({ length: 255, nullable: true })
  @ApiProperty({
    description: '用户头像URL',
    required: false,
    example: 'https://example.com/avatar.jpg'
  })
  image: string

  @Column({ length: 20, nullable: true })
  @ApiProperty({
    description: '手机号码',
    required: false,
    example: '13800138000'
  })
  phone: string

  @Column({ length: 100, nullable: true, unique: true })
  @ApiProperty({
    description: '电子邮箱',
    format: 'email',
    example: 'user@example.com',
    required: false
  })
  email: string

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  @ApiProperty({ description: '创建时间', example: '2023-07-01T00:00:00.000Z' })
  created_at: Date

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  @ApiProperty({
    description: '最后更新时间',
    example: '2023-07-01T00:00:00.000Z'
  })
  updated_at: Date

  @OneToMany(() => ArticleComment, (comment) => comment.user)
  @ApiProperty({
    description: '关联的评论列表',
    type: () => ArticleComment,
    isArray: true,
    required: false
  })
  comments: ArticleComment[]

  // 留言板的评论
  @OneToMany(() => Message, (message) => message.user)
  @ApiProperty({
    description: '关联的留言列表',
    type: () => Message,
    isArray: true,
    required: false
  })
  messages: Message[]

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER
  })
  @ApiProperty({
    description: '用户角色',
    enum: UserRole,
    example: UserRole.USER,
    default: UserRole.USER
  })
  role: UserRole

  @Column('int', { default: RolePermissions[UserRole.USER] })
  @ApiProperty({
    description: '用户权限值',
    example: RolePermissions[UserRole.USER],
    default: RolePermissions[UserRole.USER]
  })
  permissions: number

  // OTP 密钥
  @Column({ nullable: true })
  @ApiProperty({ description: 'OTP 密钥', required: false })
  otp_secret: string
}
