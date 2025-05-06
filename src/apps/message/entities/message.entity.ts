import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity({ name: 'message' })
export class Message {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('text')
    content: string;

    @ManyToOne(() => User, user => user.messages)
    user: User;

    @ManyToOne(() => Message, message => message.replies, {
        onDelete: 'CASCADE'  // 当父留言被删除时，自动删除所有回复
    })
    parent: Message;

    @OneToMany(() => Message, message => message.parent)
    replies: Message[];

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    updated_at: Date;

    @Column({ default: false })
    isDeleted: boolean;

    @Column({ nullable: true })
    nickname: string;

    @Column({ nullable: true })
    email: string;
}