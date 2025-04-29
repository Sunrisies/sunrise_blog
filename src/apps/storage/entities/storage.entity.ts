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

  // 在添加一个字段，代表是哪个第三方云存储的文件，例如：'aliyun'、'tencent'、'qiniu' 等
  @Column({ length: 50, nullable: true }) // 假设最大长度为50，你可以根据实际情况调整
  storage_provider?: string;
}
