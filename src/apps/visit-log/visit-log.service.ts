import { Inject, Injectable, Scope } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VisitLog } from './entities/visit-log.entity';
import { CreateVisitLogDto } from './dto/create-visit-log.dto';
import { Session } from './entities/session.entity';
import { RequestLog } from './entities/request-log.entity';
@Injectable()
export class VisitLogService {
  constructor(
    @InjectRepository(VisitLog, 'postgres')
    private visitLogRepository: Repository<VisitLog>,
    @InjectRepository(Session, 'postgres')
    private sessionRepository: Repository<Session>,
    @InjectRepository(RequestLog, 'postgres')
    private requestLogRepository: Repository<RequestLog>,
  ) { }
  async saveRequestLog(requestInfo: Partial<RequestLog>) {
    return this.requestLogRepository.save(requestInfo);
  }

  async create(createVisitLogDto: CreateVisitLogDto) {

  }

  async findAll(page: number, limit: number) {
    try {
      // 1. 首先查询访问日志
      const [logs, total] = await this.visitLogRepository.findAndCount({
        skip: (page - 1) * limit,
        take: limit,
        order: {
          created_at: 'DESC'
        }
      });

      // 2. 收集所有的 session_id
      const sessionIds = logs.map(log => log.session_id);

      // 3. 批量查询相关的 session 信息
      const sessions = await this.sessionRepository.findByIds(sessionIds);

      // 4. 创建一个 session_id 到 session 的映射
      const sessionMap = new Map(sessions.map(session => [session.session_id, session]));

      // 5. 组合访问日志和 session 信息
      const combinedData = logs.map(log => ({
        ...log,
        session: sessionMap.get(log.session_id) || null
      }));

      return {
        code: 200,
        data: {
          data: combinedData,
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
