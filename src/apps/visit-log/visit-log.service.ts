import { Inject, Injectable, Scope } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VisitLog } from './entities/visit-log.entity';
import { CreateVisitLogDto } from './dto/create-visit-log.dto';
@Injectable()
export class VisitLogService {
  constructor(
    @InjectRepository(VisitLog)
    private visitLogRepository: Repository<VisitLog>
  ) { }

  async create(createVisitLogDto: CreateVisitLogDto) {
    try {
      const visitLog = this.visitLogRepository.create({
        ...createVisitLogDto,
        timestamp: new Date(createVisitLogDto.timestamp)
      });
      console.log('访问日志记录成功')
      await this.visitLogRepository.save(visitLog);
      return {
        code: 200,
        message: '访问日志记录成功'
      };
    } catch (error) {
      console.error('记录访问日志失败:', error);
      return {
        code: 500,
        message: '访问日志记录失败'
      };
    }
  }

  async findAll(page: number, limit: number) {
    try {
      const [logs, total] = await this.visitLogRepository.findAndCount({
        skip: (page - 1) * limit,
        take: limit,
        order: {
          timestamp: 'DESC'
        }
      });

      return {
        code: 200,
        data: {
          data: logs,
          pagination: {
            page,
            limit,
            total
          }
        }
      };
    } catch (error) {
      console.error('获取访问日志失败:', error);
      return {
        code: 500,
        message: '获取访问日志失败',
        data: null
      };
    }
  }
 
}
