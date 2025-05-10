import { Module } from '@nestjs/common';
import { GithubRepositoriesService } from './github-repositories.service';
import { GithubRepositoriesController } from './github-repositories.controller';

@Module({
  controllers: [GithubRepositoriesController],
  providers: [GithubRepositoriesService],
})
export class GithubRepositoriesModule {}
