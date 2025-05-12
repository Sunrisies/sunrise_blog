import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { User } from '@/apps/user/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'message' })
export class Message {
    @PrimaryGeneratedColumn()
    @ApiProperty({ description: '留言id', example: 1 })
    id: number;

    @ApiProperty({ description: '留言内容', example: '这是一条留言' })
    @Column('text')
    content: string;

    @ApiProperty({ description: '留言用户', example: 1 })
    @ManyToOne(() => User, user => user.messages)
    user: User;

    @ApiProperty({ description: '回复留言', example: 1 })
    @ManyToOne(() => Message, message => message.replies, {
        onDelete: 'CASCADE'  // 当父留言被删除时，自动删除所有回复
    })
    parent: Message;

    @ApiProperty({ description: '回复留言', example: 1 })
    @OneToMany(() => Message, message => message.parent)
    replies: Message[];

    @ApiProperty({ description: '创建时间', example: '2020-01-01 00:00:00' })
    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;

    @ApiProperty({ description: '更新时间', example: '2020-01-01 00:00:00' })
    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    updated_at: Date;

    @ApiProperty({ description: '是否删除', example: false })
    @Column({ default: false })
    isDeleted: boolean;

    @ApiProperty({ description: '昵称', example: '张三' })
    @Column({ nullable: true })
    nickname: string;

    @ApiProperty({ description: '邮箱', example: '329112@qq.com' })
    @Column({ nullable: true })
    email: string;
}