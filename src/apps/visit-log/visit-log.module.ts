import { Module } from '@nestjs/common';
import { VisitLogService } from './visit-log.service';
import { VisitLogController } from './visit-log.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VisitLog } from './entities/visit-log.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([VisitLog])
  ],
  controllers: [VisitLogController],
  providers: [VisitLogService],
})
export class VisitLogModule {}
