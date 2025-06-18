import { Injectable } from '@nestjs/common';
import { ArticleService } from '@/apps/article/article.service';
import { PaginatedResponseDto, SitemapItem } from '@/types';

@Injectable()
export class SitemapService {
  constructor(private readonly articleService: ArticleService) {}

  async getSitemap(): Promise<PaginatedResponseDto<SitemapItem>> {
    try {
      // 获取所有文章
      const articles = await this.articleService.getAllArticles();
      // 基础路由
      const routes: SitemapItem[] = [
        {
          url: 'https://sunrise1024.top',
          lastModified: new Date(),
          changeFrequency: 'daily',
          priority: 1,
        },
        {
          url: 'https://sunrise1024.top/about',
          lastModified: new Date(),
          changeFrequency: 'monthly',
          priority: 0.8,
        },
        {
          url: 'https://sunrise1024.top/gallery',
          lastModified: new Date(),
          changeFrequency: 'weekly',
          priority: 0.8,
        },
      ];

      // 文章路由
      const articleRoutes = articles.data.map((article: any) => ({
        url: `https://sunrise1024.top/article/${article.id}`,
        lastModified: new Date(article.updated_at || article.created_at),
        changeFrequency: 'weekly',
        priority: 0.6,
      }));

      return {
        code: 200,
        data: {
          data: [...routes, ...articleRoutes],
          pagination: { total: articleRoutes.length, page: 1, limit: 100 },
        },
      };
    } catch (error) {
      return {
        code: 500,
        message: '获取站点地图失败',
        data: null,
      };
    }
  }
}
