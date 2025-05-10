import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GithubCommit } from './entities/github-commit.entity';
import { Cron, CronExpression } from '@nestjs/schedule';
import * as https from 'https';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GithubCommitService {
  private readonly logger = new Logger(GithubCommitService.name);

  constructor(
    @InjectRepository(GithubCommit)
    private githubCommitRepository: Repository<GithubCommit>,
    private configService: ConfigService,
  ) { }

  @Cron('0 04 16 * * *') // 每天凌晨2点执行
  async syncGithubCommits() {
    console.log('开始同步GitHub提交记录');
    try {
      const repos = [
        { owner: 'Sunrisies', repo: 'react-images', branch: 'admin' },
        // 可以添加更多仓库配置
      ];

      for (const repo of repos) {
        await this.fetchAndSaveCommits(repo);
      }
    } catch (error) {
      this.logger.error('同步GitHub提交记录失败:', error);
    }
  }

  private async fetchAndSaveCommits({ owner, repo, branch }) {
    const url = `https://api.github.com/repos/${owner}/${repo}/commits?sha=${branch}&page=1&per_page=100`;

    try {
      const response = await new Promise((resolve, reject) => {
        const req = https.get(url, {
          headers: {
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'Node.js'
          }
        }, (res) => {
          let data = '';

          res.on('data', (chunk) => {
            data += chunk;
          });

          res.on('end', () => {
            resolve(JSON.parse(data));
          });
        });

        req.on('error', (error) => {
          reject(error);
        });

        req.end();
      });

      const commits = response as any[];
      for (const commit of commits) {
        const existingCommit = await this.githubCommitRepository.findOne({
          where: { sha: commit.sha }
        });

        if (!existingCommit) {
          const newCommit = new GithubCommit();
          newCommit.sha = commit.sha;
          newCommit.node_id = commit.node_id;
          newCommit.author_name = commit.commit.author.name;
          newCommit.author_email = commit.commit.author.email;
          newCommit.commit_date = new Date(commit.commit.author.date);
          newCommit.message = commit.commit.message;
          newCommit.tree_sha = commit.commit.tree.sha;
          newCommit.url = commit.url;
          newCommit.html_url = commit.html_url;
          newCommit.comments_url = commit.comments_url;
          newCommit.comment_count = commit.commit.comment_count;
          newCommit.parent_sha = commit.parents[0]?.sha || null;
          newCommit.parent_url = commit.parents[0]?.url || null;
          newCommit.verified = commit.commit.verification.verified;
          newCommit.verify_reason = commit.commit.verification.reason;
          newCommit.repository = repo;
          newCommit.branch = branch;

          await this.githubCommitRepository.save(newCommit);
          console.log(`成功保存提交记录: ${commit.sha}`);
        } else {
          console.log(`提交记录已存在: ${commit.sha}`);
        }
      }
    } catch (error) {
      this.logger.error(`获取 ${owner}/${repo} 提交记录失败:`, error);
      throw error;
    }
  }

  // 获取提交记录的API
  async getCommits(page = 1, limit = 10) {
    const [items, total] = await this.githubCommitRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { commit_date: 'DESC' }
    });

    return {
      items,
      total,
      page,
      limit
    };
  }
}
