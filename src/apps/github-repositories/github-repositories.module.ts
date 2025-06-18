import { Module } from '@nestjs/common';
import { GithubRepositoriesService } from './github-repositories.service';
import { GithubRepositoriesController } from './github-repositories.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GithubRepository } from './entities/github-repository.entity';

@Module({
  imports: [TypeOrmModule.forFeature([GithubRepository])],
  controllers: [GithubRepositoriesController],
  providers: [GithubRepositoriesService],
  exports: [GithubRepositoriesService],
})
export class GithubRepositoriesModule {}
