import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ArticleComment } from '../../article-comments/entities/article-comment.entity';

@Entity({ name: 'users' })
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 50, unique: true })
    user_name: string;

    @Column({ length: 255 })
    pass_word: string;

    @Column({ length: 255, nullable: true })
    image: string;

    @Column({ length: 20, nullable: true })
    phone: string;

    @Column({ length: 100, nullable: true, unique: true })
    email: string;

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    updated_at: Date;

    @OneToMany(() => ArticleComment, comment => comment.user)
    comments: ArticleComment[];
}