import { Module } from '@nestjs/common'
import { SitemapController } from './sitemap.controller'
import { SitemapService } from './sitemap.service'
import { ArticleModule } from '@/apps/article/article.module'

@Module({
  imports: [ArticleModule],
  controllers: [SitemapController],
  providers: [SitemapService]
})
export class SitemapModule {}
