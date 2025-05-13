import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from "@nestjs/common";
import { Request, Response } from 'express';
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
interface IResponse<T> {
  code: number;
  message?: string;
  data?: T;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, IResponse<T>> {
  private logger = new Logger('TransformInterceptor');
  private getClientIp(request: Request): string {
    // 按优先级获取IP地址
    return (
      // X-Forwarded-For 是一个标准的代理头部
      request.headers['x-forwarded-for'] as string ||
      // X-Real-IP 通常由 Nginx 设置
      request.headers['x-real-ip'] as string ||
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
  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<IResponse<T>> | Promise<Observable<IResponse<T>>> {
    const request = context.switchToHttp().getRequest<Request>();
    const requestInfo = {
      method: request.method,
      url: request.url,
      ip: this.getClientIp(request),
      userAgent: request.headers['user-agent'],
      referer: request.headers.referer || '',
      host: request.headers.host,
      timestamp: new Date().toISOString(),
      // 添加代理相关信息，用于调试
      forwardedFor: request.headers['x-forwarded-for'],
      realIp: request.headers['x-real-ip']
    };
    console.log(requestInfo);
    this.logger.log(`请求信息: ${JSON.stringify(requestInfo)}`);
    const response = context.switchToHttp().getResponse<Response>();
    return next.handle().pipe(
      map((data) => {
        if (request.method === 'POST' && response.statusCode === 201) {
          response.statusCode = 200; // 修改为 200 状态码
        }
        return {
          code: 200, //状态码
          ...data, //返回数据
        };
      }),
    );
  }
}
