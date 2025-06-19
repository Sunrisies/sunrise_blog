import { Entity, Column, PrimaryColumn, Index } from 'typeorm'

@Entity({ name: 'session', schema: 'public' })
@Index('session_created_at_idx', ['created_at'])
@Index('session_website_id_created_at_browser_idx', ['website_id', 'created_at', 'browser'])
@Index('session_website_id_created_at_city_idx', ['website_id', 'created_at', 'city'])
@Index('session_website_id_created_at_country_idx', ['website_id', 'created_at', 'country'])
@Index('session_website_id_created_at_device_idx', ['website_id', 'created_at', 'device'])
@Index('session_website_id_created_at_hostname_idx', ['website_id', 'created_at', 'hostname'])
@Index('session_website_id_created_at_idx', ['website_id', 'created_at'])
@Index('session_website_id_created_at_language_idx', ['website_id', 'created_at', 'language'])
@Index('session_website_id_created_at_os_idx', ['website_id', 'created_at', 'os'])
@Index('session_website_id_created_at_screen_idx', ['website_id', 'created_at', 'screen'])
@Index('session_website_id_created_at_subdivision1_idx', ['website_id', 'created_at', 'subdivision1'])
@Index('session_website_id_idx', ['website_id'])
export class Session {
  @PrimaryColumn('uuid')
  session_id: string

  @Column('uuid')
  website_id: string

  @Column({ type: 'varchar', length: 100, nullable: true })
  hostname: string

  @Column({ type: 'varchar', length: 20, nullable: true })
  browser: string

  @Column({ type: 'varchar', length: 20, nullable: true })
  os: string

  @Column({ type: 'varchar', length: 20, nullable: true })
  device: string

  @Column({ type: 'varchar', length: 11, nullable: true })
  screen: string

  @Column({ type: 'varchar', length: 35, nullable: true })
  language: string

  @Column({ type: 'char', length: 2, nullable: true })
  country: string

  @Column({ type: 'varchar', length: 20, nullable: true })
  subdivision1: string

  @Column({ type: 'varchar', length: 50, nullable: true })
  subdivision2: string

  @Column({ type: 'varchar', length: 50, nullable: true })
  city: string

  @Column({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP'
  })
  created_at: Date
}
