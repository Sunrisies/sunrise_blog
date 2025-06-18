import { CustomUnauthorizedException } from '@/utils/custom-exceptions';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JsonWebTokenError, JwtService, TokenExpiredError } from '@nestjs/jwt';
import { Request } from 'express';
import Redis from 'ioredis';

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    @InjectRedis() private readonly redis: Redis,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new CustomUnauthorizedException('没有 Token');
    }

    const secret = this.configService.get('jwt.secret');
    const tokenData = await this.redis.get(`access_token:${token}`);
    if (!tokenData) {
      throw new CustomUnauthorizedException('令牌已失效');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret,
      });

      // 将用户信息和权限信息添加到请求中
      request['user'] = {
        ...payload,
        permissions: JSON.parse(tokenData).permissions,
      };
      console.log(request['user'], 'payload');
      // 获取路由所需的权限
      const requiredPermissions = this.reflector.get<number[]>(
        'permissions',
        context.getHandler(),
      );
      console.log(requiredPermissions);
      // 如果路由没有设置权限要求，则允许访问
      if (!requiredPermissions) {
        return true;
      }

      // 验证用户权限
      const userPermissions = request.user.permissions;
      console.log(userPermissions, 'userPermissions');
      if (!userPermissions) {
        throw new CustomUnauthorizedException('用户没有任何权限');
      }

      // 使用位运算检查权限
      const hasPermission = requiredPermissions.every(
        (permission) => (userPermissions & permission) === permission,
      );
      console.log(hasPermission, 'hasPermission');
      if (!hasPermission) {
        throw new CustomUnauthorizedException('权限不足');
      }
      return true;
    } catch (error) {
      if (error instanceof CustomUnauthorizedException) {
        throw error; // 直接抛出权限相关的异常
      } else if (error instanceof TokenExpiredError) {
        throw new CustomUnauthorizedException('Token 已过期');
      } else if (error instanceof JsonWebTokenError) {
        throw new CustomUnauthorizedException('无效的 Token');
      } else {
        throw new CustomUnauthorizedException('Token 验证失败');
      }
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
