import { PaginatedResponseDto, ResponseDto, SyncResult } from '@/types'
import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Cron } from '@nestjs/schedule'
import { InjectRepository } from '@nestjs/typeorm'
import * as https from 'https'
import { Repository } from 'typeorm'
import { GithubRepository } from '../github-repositories/entities/github-repository.entity'
import { GithubCommit } from './entities/github-commit.entity'

@Injectable()
export class GithubCommitService {
  private readonly logger = new Logger(GithubCommitService.name)

  constructor(
    @InjectRepository(GithubCommit)
    private githubCommitRepository: Repository<GithubCommit>,
    @InjectRepository(GithubRepository)
    private githubRepositoryRepository: Repository<GithubRepository>,
    private configService: ConfigService
  ) {}

  @Cron('0 25 16 * * *') // 每天凌晨2点执行
  async syncGithubCommits() {
    console.log('开始同步GitHub提交记录')
    try {
      await this.syncAllEnabledRepositories()
    } catch (error) {
      this.logger.error('同步GitHub提交记录失败:', error)
    }
  }

  // 新增手动同步方法
  async manualSync(): Promise<ResponseDto<SyncResult[]>> {
    try {
      console.log('开始手动同步GitHub提交记录')
      const result = await this.syncAllEnabledRepositories()
      return {
        message: '手动同步成功',
        data: result
      }
    } catch (error) {
      this.logger.error('手动同步GitHub提交记录失败:', error)
      throw error
    }
  }

  // 抽取公共同步逻辑
  private async syncAllEnabledRepositories(): Promise<SyncResult[]> {
    const repos = await this.githubRepositoryRepository.find({
      where: { enabled: true }
    })

    const results: SyncResult[] = []
    for (const repo of repos) {
      try {
        await this.fetchAndSaveCommits({
          owner: repo.owner,
          repo: repo.repository,
          branch: repo.branch
        })

        // 更新最后同步时间
        await this.githubRepositoryRepository.update(repo.id, {
          last_sync_at: new Date()
        })

        results.push({
          repository: repo.repository,
          status: 'success'
        })
      } catch (error) {
        results.push({
          repository: repo.repository,
          status: 'failed',
          error: error.message
        })
      }
    }

    return results
  }

  private async fetchAndSaveCommits({ owner, repo, branch }) {
    const url = `https://api.github.com/repos/${owner}/${repo}/commits?sha=${branch}&page=1&per_page=100`

    try {
      const response = await new Promise((resolve, reject) => {
        const req = https.get(
          url,
          {
            headers: {
              Accept: 'application/vnd.github.v3+json',
              'User-Agent': 'Node.js'
            }
          },
          (res) => {
            let data = ''

            res.on('data', (chunk) => {
              data += chunk
            })

            res.on('end', () => {
              resolve(JSON.parse(data))
            })
          }
        )

        req.on('error', (error) => {
          reject(error)
        })

        req.end()
      })

      const commits = response as any[]
      for (const commit of commits) {
        const existingCommit = await this.githubCommitRepository.findOne({
          where: { sha: commit.sha }
        })

        if (!existingCommit) {
          const newCommit = new GithubCommit()
          newCommit.sha = commit.sha
          newCommit.node_id = commit.node_id
          newCommit.author_name = commit.commit.author.name
          newCommit.author_email = commit.commit.author.email
          newCommit.commit_date = new Date(commit.commit.author.date)
          newCommit.message = commit.commit.message
          newCommit.tree_sha = commit.commit.tree.sha
          newCommit.url = commit.url
          newCommit.html_url = commit.html_url
          newCommit.comments_url = commit.comments_url
          newCommit.comment_count = commit.commit.comment_count
          newCommit.parent_sha = commit.parents[0]?.sha || null
          newCommit.parent_url = commit.parents[0]?.url || null
          newCommit.verified = commit.commit.verification.verified
          newCommit.verify_reason = commit.commit.verification.reason
          newCommit.repository = repo
          newCommit.branch = branch

          await this.githubCommitRepository.save(newCommit)
          console.log(`成功保存提交记录: ${commit.sha}`)
        } else {
          console.log(`提交记录已存在: ${commit.sha}`)
        }
      }
    } catch (error) {
      this.logger.error(`获取 ${owner}/${repo} 提交记录失败:`, error)
      throw error
    }
  }

  // 获取提交记录的API
  async getCommits(
    page = 1,
    limit = 10,
    filters: { repository?: string; branch?: string }
  ): Promise<PaginatedResponseDto<GithubCommit>> {
    const queryBuilder = this.githubCommitRepository.createQueryBuilder('commit')

    // 添加过滤条件
    if (filters.repository) {
      queryBuilder.andWhere('commit.repository = :repository', {
        repository: filters.repository
      })
    }

    if (filters.branch) {
      queryBuilder.andWhere('commit.branch = :branch', {
        branch: filters.branch
      })
    }

    // 添加排序和分页
    queryBuilder
      .orderBy('commit.commit_date', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)

    const [items, total] = await queryBuilder.getManyAndCount()

    return {
      code: 200,
      data: {
        data: items,
        pagination: {
          total,
          page,
          limit
        }
      },
      message: '获取提交记录成功'
    }
  }
}
