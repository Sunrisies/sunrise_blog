import { Module } from '@nestjs/common';
import { VisitLogService } from './visit-log.service';
import { VisitLogController } from './visit-log.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VisitLog } from './entities/visit-log.entity';
import { Session } from './entities/session.entity';
import { RequestLog } from './entities/request-log.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([VisitLog, Session, RequestLog], 'postgres'),
  ],
  controllers: [VisitLogController],
  providers: [VisitLogService],
  exports: [VisitLogService],
})
export class VisitLogModule {}
