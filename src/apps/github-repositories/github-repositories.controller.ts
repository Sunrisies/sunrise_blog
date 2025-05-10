import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { GithubRepositoriesService } from './github-repositories.service';
import { CreateGithubRepositoryDto } from './dto/create-github-repository.dto';
import { UpdateGithubRepositoryDto } from './dto/update-github-repository.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('GitHub仓库')
@Controller('github-repositories')
export class GithubRepositoriesController {
  constructor(private readonly githubRepositoriesService: GithubRepositoriesService) { }

  @Post()
  @ApiOperation({ summary: '创建GitHub仓库记录' })
  create(@Body() createGithubRepositoryDto: CreateGithubRepositoryDto) {
    return this.githubRepositoriesService.create(createGithubRepositoryDto);
  }

  @Get()
  @ApiOperation({ summary: '获取GitHub仓库列表' })
  findAll(@Query('page') page: number = 1, @Query('limit') limit: number = 10) {
    return this.githubRepositoriesService.findAll(page, limit);
  }

  @Get(':id')
  @ApiOperation({ summary: '获取指定GitHub仓库信息' })
  findOne(@Param('id') id: string) {
    return this.githubRepositoriesService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: '更新GitHub仓库信息' })
  update(@Param('id') id: string, @Body() updateGithubRepositoryDto: UpdateGithubRepositoryDto) {
    return this.githubRepositoriesService.update(+id, updateGithubRepositoryDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除GitHub仓库记录' })
  remove(@Param('id') id: string) {
    return this.githubRepositoriesService.remove(+id);
  }
}
