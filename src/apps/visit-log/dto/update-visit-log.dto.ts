import { PartialType } from '@nestjs/swagger'
import { CreateVisitLogDto } from './create-visit-log.dto'

export class UpdateVisitLogDto extends PartialType(CreateVisitLogDto) {}
