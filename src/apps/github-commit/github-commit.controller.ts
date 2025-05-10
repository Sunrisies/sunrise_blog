import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { GithubCommitService } from './github-commit.service';

@ApiTags('GitHub提交记录')
@Controller('github-commits')
export class GithubCommitController {
  constructor(private readonly githubCommitService: GithubCommitService) { }

  @Get()
  @ApiOperation({ summary: '获取GitHub提交记录' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async getCommits(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    return this.githubCommitService.getCommits(page, limit);
  }
}
