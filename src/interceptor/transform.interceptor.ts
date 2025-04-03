import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Request, Response } from 'express';
interface IResponse<T> {
  // [key: string]: any;
  code: number;
  message?: string;
  data?: T;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, IResponse<T>> {
  private readonly logger = new Logger(TransformInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<IResponse<T>> | Promise<Observable<IResponse<T>>> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();
    return next.handle().pipe(
      map((data) => {
        // 拷贝一份
        const newData = { ...data };
        if (request.method === 'POST' && response.statusCode === 201) {
          response.statusCode = 200; // 修改为 200 状态码
        }
        this.logger.log(`transform data: ${JSON.stringify(newData)}`);
        return {
          code: 200, //状态码
          ...data, //返回数据
        };
      }),
    );
  }
}
