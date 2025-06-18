import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('github_repositories')
export class GithubRepository {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: '主键ID' })
  id: number;

  @Column({ length: 100 })
  @ApiProperty({ description: '仓库拥有者' })
  owner: string;

  @Column({ length: 100 })
  @ApiProperty({ description: '仓库名称' })
  repository: string;

  @Column({ length: 100 })
  @ApiProperty({ description: '分支名称' })
  branch: string;

  @Column({ default: true })
  @ApiProperty({ description: '是否启用' })
  enabled: boolean;

  @CreateDateColumn()
  @ApiProperty({ description: '创建时间' })
  created_at: Date;

  @Column({ type: 'datetime', nullable: true })
  @ApiProperty({ description: '最后同步时间' })
  last_sync_at: Date;
}
