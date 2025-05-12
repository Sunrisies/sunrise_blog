import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { Article } from '@/apps/article/entities/article.entity';

@Entity({ name: 'tags' })
export class Tag {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 50 })
    name: string;

    // 新增分类类型字段
    @Column({
        type: 'enum',
        enum: ['article', 'library'],
        default: 'article'
    })
    type: string;


    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    updated_at: Date;

    @ManyToMany(() => Article, article => article.tags)
    articles: Article[];
}