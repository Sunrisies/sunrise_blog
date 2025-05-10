import { PartialType } from '@nestjs/swagger';
import { CreateGithubCommitDto } from './create-github-commit.dto';

export class UpdateGithubCommitDto extends PartialType(CreateGithubCommitDto) {}
