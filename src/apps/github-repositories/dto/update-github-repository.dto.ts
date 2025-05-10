import { PartialType } from '@nestjs/swagger';
import { CreateGithubRepositoryDto } from './create-github-repository.dto';

export class UpdateGithubRepositoryDto extends PartialType(CreateGithubRepositoryDto) {}
