import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Article } from '../../article/entities/article.entity';
import { User } from '../../user/entities/user.entity';

@Entity({ name: 'article_comment' })
export class ArticleComment {
    @PrimaryGeneratedColumn()
    id: number; // 评论ID

    @Column('text')
    content: string; // 评论内容

    @ManyToOne(() => Article, article => article.comments)
    article: Article; // 关联的文章

    @ManyToOne(() => User, user => user.comments)
    user: User; // 关联的用户

    @ManyToOne(() => ArticleComment, comment => comment.replies)
    parent: ArticleComment; // 关联的父评论

    @OneToMany(() => ArticleComment, comment => comment.parent)
    replies: ArticleComment[]; // 关联的子评论

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date; // 评论创建时间

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    updated_at: Date; // 评论更新时间

    @Column({ default: false })
    isDeleted: boolean; // 是否删除

    @Column({ nullable: true })
    nickname: string; // 昵称

    @Column({ nullable: true })
    email: string; // 邮箱
}
