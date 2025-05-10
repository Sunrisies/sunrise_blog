import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { GithubRepositoriesService } from './github-repositories.service';
import { CreateGithubRepositoryDto } from './dto/create-github-repository.dto';
import { UpdateGithubRepositoryDto } from './dto/update-github-repository.dto';

@Controller('github-repositories')
export class GithubRepositoriesController {
  constructor(private readonly githubRepositoriesService: GithubRepositoriesService) {}

  @Post()
  create(@Body() createGithubRepositoryDto: CreateGithubRepositoryDto) {
    return this.githubRepositoriesService.create(createGithubRepositoryDto);
  }

  @Get()
  findAll() {
    return this.githubRepositoriesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.githubRepositoriesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGithubRepositoryDto: UpdateGithubRepositoryDto) {
    return this.githubRepositoriesService.update(+id, updateGithubRepositoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.githubRepositoriesService.remove(+id);
  }
}
