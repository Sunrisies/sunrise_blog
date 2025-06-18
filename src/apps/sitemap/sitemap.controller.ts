import { Controller, Get } from '@nestjs/common';
import { SitemapService } from './sitemap.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PaginatedResponseDto, SitemapItem } from '@/types';

@ApiTags('站点地图')
@Controller('sitemap')
export class SitemapController {
  constructor(private readonly sitemapService: SitemapService) {}

  @Get()
  @ApiOperation({ summary: '获取站点地图数据' })
  async getSitemap(): Promise<PaginatedResponseDto<SitemapItem>> {
    return await this.sitemapService.getSitemap();
  }
}
