import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

@Entity({ name: 'request_log', schema: 'public' })
export class RequestLog {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ length: 10 })
  method: string

  @Column({ length: 500 })
  url: string

  @Column({ length: 100 })
  ip: string

  @Column({ name: 'user_agent', length: 300, nullable: true })
  userAgent: string

  @Column({ length: 500, nullable: true })
  referer: string

  @Column({ length: 100, nullable: true })
  host: string

  @Column({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP'
  })
  timestamp: Date

  @Column({ name: 'forwarded_for', type: 'text', nullable: true })
  forwardedFor: string

  @Column({ name: 'real_ip', length: 100, nullable: true })
  realIp: string

  @Column({ name: 'accept_language', length: 100, nullable: true })
  acceptLanguage: string

  @Column({ length: 20, nullable: true })
  protocol: string

  @Column({ name: 'sec_ch_ua', length: 200, nullable: true })
  secChUa: string

  @Column({ name: 'sec_ch_ua_mobile', length: 50, nullable: true })
  secChUaMobile: string

  @Column({ name: 'sec_ch_ua_platform', length: 50, nullable: true })
  secChUaPlatform: string

  @Column({ name: 'sec_fetch_dest', length: 50, nullable: true })
  secFetchDest: string

  @Column({ name: 'sec_fetch_mode', length: 50, nullable: true })
  secFetchMode: string

  @Column({ name: 'sec_fetch_site', length: 50, nullable: true })
  secFetchSite: string

  @Column({ name: 'sec_fetch_user', length: 50, nullable: true })
  secFetchUser: string

  @Column({ name: 'upgrade_insecure_requests', length: 10, nullable: true })
  upgradeInsecureRequests: string

  @Column({ length: 100, nullable: true })
  accept: string

  @Column({ type: 'jsonb', nullable: true })
  clientInfo: any
}
