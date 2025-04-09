import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, ManyToOne, JoinColumn } from 'typeorm';
import { Category } from '../../categories/entities/category.entity';
import { Tag } from '../../tags/entities/tag.entity';
@Entity({ name: 'third_party_libraries' })
export class ThirdPartyLibrary {
    @PrimaryGeneratedColumn()
    id: number; // 主键ID

    @Column({ length: 100 })
    name: string; // 库名称

    // 在类中添加标签关联
    @ManyToMany(() => Tag)
    @JoinTable({
        name: 'library_tags',
        joinColumn: { name: 'library_id' },
        inverseJoinColumn: { name: 'tag_id' }
    })
    tags: Tag[]; // 标签ID数组

    @Column({ length: 250, name: 'official_url' })
    officialUrl: string; // 官方文档URL

    @Column({ type: 'text', nullable: true })
    description: string; // 描述

    @Column({ type: 'json', nullable: true })
    metadata: Record<string, any>; // 元数据 JSON 格式

    @ManyToOne(() => Category)
    @JoinColumn({ name: 'category_id' })
    category: Category;  // 单个分类关联

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    updated_at: Date;
}