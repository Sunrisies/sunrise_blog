import { Entity, Column, PrimaryColumn, Index } from 'typeorm'

@Entity({ name: 'website_event', schema: 'public' })
@Index('website_event_created_at_idx', ['created_at'])
@Index('website_event_session_id_idx', ['session_id'])
@Index('website_event_visit_id_idx', ['visit_id'])
@Index('website_event_website_id_created_at_event_name_idx', ['website_id', 'created_at', 'event_name'])
@Index('website_event_website_id_created_at_idx', ['website_id', 'created_at'])
@Index('website_event_website_id_created_at_page_title_idx', ['website_id', 'created_at', 'page_title'])
@Index('website_event_website_id_created_at_referrer_domain_idx', ['website_id', 'created_at', 'referrer_domain'])
@Index('website_event_website_id_created_at_tag_idx', ['website_id', 'created_at', 'tag'])
@Index('website_event_website_id_created_at_url_path_idx', ['website_id', 'created_at', 'url_path'])
@Index('website_event_website_id_created_at_url_query_idx', ['website_id', 'created_at', 'url_query'])
@Index('website_event_website_id_idx', ['website_id'])
@Index('website_event_website_id_session_id_created_at_idx', ['website_id', 'session_id', 'created_at'])
@Index('website_event_website_id_visit_id_created_at_idx', ['website_id', 'visit_id', 'created_at'])
export class VisitLog {
  @PrimaryColumn('uuid')
  event_id: string

  @Column('uuid')
  website_id: string

  @Column('uuid')
  session_id: string

  @Column('uuid')
  visit_id: string

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP'
  })
  created_at: Date

  @Column({ type: 'varchar', length: 500 })
  url_path: string

  @Column({ type: 'varchar', length: 500, nullable: true })
  url_query: string

  @Column({ type: 'varchar', length: 500, nullable: true })
  referrer_path: string

  @Column({ type: 'varchar', length: 500, nullable: true })
  referrer_query: string

  @Column({ type: 'varchar', length: 500, nullable: true })
  referrer_domain: string

  @Column({ type: 'varchar', length: 500, nullable: true })
  page_title: string

  @Column({ type: 'integer', default: 1 })
  event_type: number

  @Column({ type: 'varchar', length: 50, nullable: true })
  event_name: string

  @Column({ type: 'varchar', length: 50, nullable: true })
  tag: string
}
