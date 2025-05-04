import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class VisitLog {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: '访问日志ID' })
  id: number;

  @Column({ nullable: true })
  @ApiProperty({ description: '访问IP' })
  ip: string;

  @Column({ nullable: true, type: 'text' })
  @ApiProperty({ description: '用户代理' })
  userAgent: string;

  @Column({ nullable: true })
  @ApiProperty({ description: '来源页面' })
  referer: string;

  @Column()
  @ApiProperty({ description: '访问URL' })
  url: string;

  @Column()
  @ApiProperty({ description: '请求方法' })
  method: string;

  @Column()
  @ApiProperty({ description: '访问时间' })
  timestamp: Date;

  @Column()
  @ApiProperty({ description: '浏览器名称' })
  browserName: string;

  @Column()
  @ApiProperty({ description: '浏览器版本' })
  browserVersion: string;

  @Column()
  @ApiProperty({ description: '浏览器主版本' })
  browserMajor: string;

  @Column()
  @ApiProperty({ description: '设备类型' })
  deviceType: string;

  @Column()
  @ApiProperty({ description: '设备型号' })
  deviceModel: string;

  @Column()
  @ApiProperty({ description: '设备厂商' })
  deviceVendor: string;

  @Column()
  @ApiProperty({ description: '操作系统名称' })
  osName: string;

  @Column()
  @ApiProperty({ description: '操作系统版本' })
  osVersion: string;

  @Column({ nullable: true })
  @ApiProperty({ description: '国家', required: false })
  country?: string;

  @Column({ nullable: true })
  @ApiProperty({ description: '地区', required: false })
  region?: string;

  @Column({ nullable: true })
  @ApiProperty({ description: '城市', required: false })
  city?: string;

  @Column({ nullable: true, type: 'float' })
  @ApiProperty({ description: '加载时间', required: false })
  loadTime?: number;

  @Column({ nullable: true, type: 'float' })
  @ApiProperty({ description: 'DOM准备时间', required: false })
  domReady?: number;

  @Column({ nullable: true, type: 'float' })
  @ApiProperty({ description: '首次绘制时间', required: false })
  firstPaint?: number;
}