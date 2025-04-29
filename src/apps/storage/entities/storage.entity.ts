import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class Storage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  path: string;

  @Column({ length: 255, nullable: true })
  title?: string;

  @Column({ nullable: true })
  size?: string;

  @Column({ length: 255, nullable: true })
  type?: string;

  @CreateDateColumn({ type: 'datetime' })
  created_at: Date;
}
