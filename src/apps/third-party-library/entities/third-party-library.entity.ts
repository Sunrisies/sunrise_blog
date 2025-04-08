import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm';
import { Category } from '../../categories/entities/category.entity';

@Entity({ name: 'third_party_libraries' })
export class ThirdPartyLibrary {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 100 })
    name: string;

    @Column({
        type: 'enum',
        enum: ['npm', 'composer', 'pypi', 'website', 'docker', 'other'],
        default: 'npm'
    })
    package_type: string;

    @Column({ length: 50 })
    language: string;

    @Column({ length: 500 })
    official_url: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ type: 'json', nullable: true })
    metadata: Record<string, any>;

    @ManyToMany(() => Category)
    @JoinTable({
        name: 'library_categories',
        joinColumn: { name: 'library_id' },
        inverseJoinColumn: { name: 'category_id' }
    })
    categories: Category[];

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    updated_at: Date;
}