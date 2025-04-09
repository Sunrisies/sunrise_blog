import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ArticleComment } from '../../article-comments/entities/article-comment.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'users' })
export class User {
    @PrimaryGeneratedColumn()
    @ApiProperty({ description: '用户ID', example: 1 })
    id: number;

    @Column({ length: 50, unique: true })
    @ApiProperty({ description: '用户名', example: 'john_doe', maxLength: 50 })
    user_name: string;

    @Column({ length: 255 })
    @ApiProperty({ description: '加密后的密码', minLength: 6, maxLength: 255 })
    pass_word: string;

    @Column({ length: 255, nullable: true })
    @ApiProperty({ description: '用户头像URL', required: false, example: 'https://example.com/avatar.jpg' })
    image: string;

    @Column({ length: 20, nullable: true })
    @ApiProperty({ description: '手机号码', required: false, example: '13800138000' })
    phone: string;

    @Column({ length: 100, nullable: true, unique: true })
    @ApiProperty({
        description: '电子邮箱',
        format: 'email',
        example: 'user@example.com',
        required: false
    })
    email: string;

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    @ApiProperty({ description: '创建时间', example: '2023-07-01T00:00:00.000Z' })
    created_at: Date;

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    @ApiProperty({ description: '最后更新时间', example: '2023-07-01T00:00:00.000Z' })
    updated_at: Date;

    @OneToMany(() => ArticleComment, comment => comment.user)
    @ApiProperty({
        description: '关联的评论列表',
        type: () => ArticleComment,
        isArray: true,
        required: false
    })
    comments: ArticleComment[];
}