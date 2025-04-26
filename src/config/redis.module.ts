import { Module } from '@nestjs/common';
import { RedisModule } from '@nestjs-modules/ioredis';
import { ConfigService } from '@nestjs/config';
import Joi from 'joi';

@Module({
  imports: [
    RedisModule.forRootAsync({
      useFactory: async (configService: ConfigService) => {
        // 添加校验
        const validationSchema = Joi.object({
          redis: Joi.object({
            type: Joi.string().required(), // 类型为字符串，必填
            url: Joi.string().required(), // URL 为字符串，必填
          }),
        })
        const config = { redis: configService.get('redis') } // 从 ConfigService 获取 redis configuration
        const { error, value } = validationSchema.validate(config);
        if (error) {
          throw new Error(`Config validation error: ${error.message}`);
        }
        return {
          type: value.redis.type,
          url: value.redis.url,
        }
      },
      inject: [ConfigService]
    }),
  ],
  exports: [RedisModule]
})
export class RedisConnectionModule { }