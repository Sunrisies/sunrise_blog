import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { GithubCommit } from './entities/github-commit.entity'
import { GithubCommitService } from './github-commit.service'
import { GithubCommitController } from './github-commit.controller'
import { ScheduleModule } from '@nestjs/schedule'
import { GithubRepository } from '../github-repositories/entities/github-repository.entity'

@Module({
  imports: [TypeOrmModule.forFeature([GithubCommit, GithubRepository]), ScheduleModule.forRoot()],
  providers: [GithubCommitService],
  controllers: [GithubCommitController]
})
export class GithubCommitModule {}
