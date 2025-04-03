import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import { Category } from '../../categories/entities/category.entity';
import { Tag } from '../../tags/entities/tag.entity';
// import { TextComment } from '../../text-comments/entities/text-comment.entity';

@Entity({ name: 'article' })
export class Article {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 50 })
    title: string;

    @Column('longtext')
    content: string;

    @ManyToOne(() => Category, category => category.articles)
    category: Category;

    @ManyToMany(() => Tag, tag => tag.articles)
    @JoinTable({ name: 'article_tags' })
    tags: Tag[];

    @Column({ length: 255 })
    cover: string;

    @Column({ length: 50 })
    author: string;

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    publish_time: Date;

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    update_time: Date;

    @Column({ default: 0 })
    views: number;

    @Column({ default: false })
    is_top: boolean;

    @Column({ default: false })
    is_recommend: boolean;

    @Column({ default: false })
    is_delete: boolean;

    @Column({ default: false })
    is_publish: boolean;

    @Column({ default: true })
    is_hide: boolean;


    @Column({ length: 255 })
    description: string;

    @Column({ default: 0 })
    size: number;

    // @OneToMany(() => TextComment, comment => comment.article)
    // comments: TextComment[];
}
