import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
// import { Article } from '../../article/entities/article.entity';

@Entity({ name: 'tags' })
export class Tag {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 50 })
    name: string;

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    updated_at: Date;

    // @ManyToMany(() => Article, article => article.tags)
    // articles: Article[];
}