import { Injectable } from '@nestjs/common';
import { CreateGithubRepositoryDto } from './dto/create-github-repository.dto';
import { UpdateGithubRepositoryDto } from './dto/update-github-repository.dto';

@Injectable()
export class GithubRepositoriesService {
  create(createGithubRepositoryDto: CreateGithubRepositoryDto) {
    return 'This action adds a new githubRepository';
  }

  findAll() {
    return `This action returns all githubRepositories`;
  }

  findOne(id: number) {
    return `This action returns a #${id} githubRepository`;
  }

  update(id: number, updateGithubRepositoryDto: UpdateGithubRepositoryDto) {
    return `This action updates a #${id} githubRepository`;
  }

  remove(id: number) {
    return `This action removes a #${id} githubRepository`;
  }
}
