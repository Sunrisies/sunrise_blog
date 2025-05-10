import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GithubCommit } from './entities/github-commit.entity';
import { GithubCommitService } from './github-commit.service';
import { GithubCommitController } from './github-commit.controller';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    TypeOrmModule.forFeature([GithubCommit]),
    ScheduleModule.forRoot(),
  ],
  providers: [GithubCommitService],
  controllers: [GithubCommitController],
})
export class GithubCommitModule { }
