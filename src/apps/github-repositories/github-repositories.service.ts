import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateGithubRepositoryDto } from './dto/create-github-repository.dto';
import { UpdateGithubRepositoryDto } from './dto/update-github-repository.dto';
import { GithubRepository } from './entities/github-repository.entity';

@Injectable()
export class GithubRepositoriesService {
  constructor(
    @InjectRepository(GithubRepository)
    private readonly githubRepositoryRepository: Repository<GithubRepository>,
  ) { }

  async create(createGithubRepositoryDto: CreateGithubRepositoryDto) {
    const repository = this.githubRepositoryRepository.create(createGithubRepositoryDto);
    await this.githubRepositoryRepository.save(repository);
    return {
      message: '创建成功',
      data: repository
    };
  }

  async findAll(page: number, limit: number) {
    const [repositories, total] = await this.githubRepositoryRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      // relations: ['commits'],
      order: {
        created_at: 'DESC'
      }
    });

    return {
      data: {
        data: repositories,
        pagination: {
          page,
          limit,
          total
        }
      }
    };
  }

  async findOne(id: number) {
    const repository = await this.githubRepositoryRepository.findOne({
      where: { id },
      relations: ['commits']
    });

    if (!repository) {
      throw new NotFoundException(`ID为${id}的GitHub仓库不存在`);
    }

    return {
      data: repository
    };
  }

  async update(id: number, updateGithubRepositoryDto: UpdateGithubRepositoryDto) {
    const repository = await this.githubRepositoryRepository.findOneBy({ id });

    if (!repository) {
      throw new NotFoundException(`ID为${id}的GitHub仓库不存在`);
    }

    await this.githubRepositoryRepository.update(id, updateGithubRepositoryDto);
    const updated = await this.githubRepositoryRepository.findOne({
      where: { id },
      relations: ['commits']
    });

    return {
      message: '更新成功',
      data: updated
    };
  }

  async remove(id: number) {
    const repository = await this.githubRepositoryRepository.findOneBy({ id });

    if (!repository) {
      throw new NotFoundException(`ID为${id}的GitHub仓库不存在`);
    }

    await this.githubRepositoryRepository.remove(repository);
    return {
      message: '删除成功'
    };
  }
}
