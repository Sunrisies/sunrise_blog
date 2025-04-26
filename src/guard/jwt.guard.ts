import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JsonWebTokenError, JwtService, TokenExpiredError } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { CustomUnauthorizedException } from 'src/utils/custom-exceptions';
import Redis from "ioredis";
import { Request } from "express";
import { InjectRedis } from '@nestjs-modules/ioredis';
@Injectable()
export class JwtGuard implements CanActivate {
  constructor(private jwtService: JwtService, private configService: ConfigService,
    @InjectRedis() private readonly redis: Redis,
  ) {
  }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new CustomUnauthorizedException("没有 Token");
    }
    const secret = this.configService.get('jwt.secret');
    const isBlacklisted = await this.redis.get(`access_token:${token}`);
    if (!isBlacklisted) {
      throw new CustomUnauthorizedException("令牌已失效");
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret
      });
      request["user"] = payload;

    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new CustomUnauthorizedException("Token 已过期");
      } else if (error instanceof JsonWebTokenError) {
        throw new CustomUnauthorizedException("无效的 Token");
      } else {
        throw new CustomUnauthorizedException("Token 验证失败");
      }
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(" ") ?? [];
    return type === "Bearer" ? token : undefined;
  }
}
