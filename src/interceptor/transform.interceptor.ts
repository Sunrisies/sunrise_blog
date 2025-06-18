import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { VisitLogService } from '@/apps/visit-log/visit-log.service';
interface IResponse<T> {
  code: number;
  message?: string;
  data?: T;
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, IResponse<T>>
{
  private logger = new Logger('TransformInterceptor');
  constructor(private readonly visitLogService: VisitLogService) {}
  private getClientIp(request: Request): string {
    // 按优先级获取IP地址
    return (
      // X-Forwarded-For 是一个标准的代理头部
      (request.headers['x-forwarded-for'] as string) ||
      // X-Real-IP 通常由 Nginx 设置
      (request.headers['x-real-ip'] as string) ||
      // 如果有代理链，获取第一个IP
      (typeof request.headers['x-forwarded-for'] === 'string'
        ? request.headers['x-forwarded-for'].split(',')[0]
        : request.headers['x-forwarded-for']?.[0]) ||
      // 直接连接的IP
      request.ip ||
      // 最后的后备选项
      request.socket.remoteAddress ||
      'unknown'
    );
  }

  private parseClientInfo(request: Request) {
    const clientInfoStr = request.headers['clientinfo'];
    try {
      return clientInfoStr ? JSON.parse(clientInfoStr as string) : null;
    } catch (e) {
      this.logger.warn('解析客户端信息失败');
      return null;
    }
  }

  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<IResponse<T>> | Promise<Observable<IResponse<T>>> {
    const request = context.switchToHttp().getRequest<Request>();

    // 解析客户端信息
    const clientInfo = this.parseClientInfo(request);

    const requestInfo = {
      method: request.method,
      url: request.url,
      ip: this.getClientIp(request),
      userAgent: request.headers['user-agent'],
      referer: request.headers.referer || '',
      host: request.headers.host,
      timestamp: new Date(),
      forwardedFor: Array.isArray(request.headers['x-forwarded-for'])
        ? request.headers['x-forwarded-for'].join(',')
        : request.headers['x-forwarded-for'] || '',
      realIp: Array.isArray(request.headers['x-real-ip'])
        ? request.headers['x-real-ip'].join(',')
        : request.headers['x-real-ip'] || '',
      // 添加其他请求头信息
      acceptLanguage: request.headers['accept-language'],
      protocol: Array.isArray(request.headers['protocol'])
        ? request.headers['protocol'].join(',')
        : request.headers['protocol'] || '',
      secChUa: String(request.headers['sec-ch-ua'] ?? ''),
      secChUaMobile: String(request.headers['sec-ch-ua-mobile'] ?? ''),
      secChUaPlatform: String(request.headers['sec-ch-ua-platform'] ?? ''),
      secFetchDest: String(request.headers['sec-fetch-dest'] ?? ''),
      secFetchMode: String(request.headers['sec-fetch-mode'] ?? ''),
      secFetchSite: String(request.headers['sec-fetch-site'] ?? ''),
      secFetchUser: String(request.headers['sec-fetch-user'] ?? ''),
      upgradeInsecureRequests: String(
        request.headers['upgrade-insecure-requests'],
      ),
      accept: request.headers['accept'],
      // 添加解析后的客户端信息
      clientInfo: clientInfo,
    };
    this.visitLogService.saveRequestLog(requestInfo); // 新增：保存请求信息
    this.logger.log(`请求信息: ${JSON.stringify(requestInfo)}`);

    const response = context.switchToHttp().getResponse<Response>();
    return next.handle().pipe(
      map((data) => {
        if (request.method === 'POST' && response.statusCode === 201) {
          response.statusCode = 200;
        }
        return {
          code: 200,
          ...data,
        };
      }),
    );
  }
}
