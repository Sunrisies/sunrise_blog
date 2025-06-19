import { Controller, Get, Post, Query } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiQuery, ApiOkResponse } from '@nestjs/swagger'
import { GithubCommitService } from './github-commit.service'
import { PaginatedResponseDto, ResponseDto, SyncResult } from '@/types'
import { GithubCommit } from './entities/github-commit.entity'

@ApiTags('GitHub提交记录')
@Controller('github-commits')
export class GithubCommitController {
  constructor(private readonly githubCommitService: GithubCommitService) {}

  @Get()
  @ApiOperation({ summary: '获取GitHub提交记录' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({
    name: 'repository',
    required: false,
    description: '仓库名称',
    type: String,
    default: 'nestjs/nest'
  })
  @ApiQuery({
    name: 'branch',
    required: false,
    description: '分支名称',
    type: String
  })
  @ApiOkResponse({
    description: '成功响应',
    type: PaginatedResponseDto<GithubCommit>
  })
  async getCommits(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('repository') repository?: string,
    @Query('branch') branch?: string
  ): Promise<PaginatedResponseDto<GithubCommit>> {
    return await this.githubCommitService.getCommits(page, limit, {
      repository,
      branch
    })
  }

  @Post('sync')
  @ApiOperation({ summary: '手动同步GitHub提交记录' })
  @ApiOkResponse({ description: '成功响应', type: ResponseDto<SyncResult[]> })
  async manualSync(): Promise<ResponseDto<SyncResult[]>> {
    return await this.githubCommitService.manualSync()
  }
}
