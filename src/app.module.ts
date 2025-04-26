import { Module } from '@nestjs/common';
import { UserModule } from './apps/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from './config/config';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './apps/auth/auth.module';
import { TagsModule } from './apps/tags/tags.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TransformInterceptor } from './interceptor/transform.interceptor';
import { CategoriesModule } from './apps/categories/categories.module';
import { ArticleModule } from './apps/article/article.module';
import { ArticleCommentsModule } from './apps/article-comments/article-comments.module';
import { ToolsModule } from './apps/tools/tools.module';
import { ThirdPartyLibraryModule } from './apps/third-party-library/third-party-library.module';
import { StorageModule } from './apps/storage/storage.module';
import * as fs from 'fs';
import * as yaml from 'yaml';
import { RedisModule } from '@nestjs-modules/ioredis';
import Joi from 'joi';
import { RedisConnectionModule } from './config/redis.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}.local`,
      load: [() => {
        const env = process.env.NODE_ENV || 'development';
        const configPath = `src/config/config.${env}.yaml`;
        const configContent = fs.readFileSync(configPath, 'utf8');
        return { ...yaml.parse(configContent), env };
      }],
    }),
    TypeOrmModule.forRootAsync(databaseConfig),
    UserModule,
    AuthModule,
    TagsModule,
    CategoriesModule,
    ArticleModule,
    ArticleCommentsModule,
    ToolsModule,
    ThirdPartyLibraryModule,
    StorageModule.forRoot({
      type: 'aliyun', // 'aliyun' 或 'qiniu'
      configuration: {
        // 阿里云配置
        region: "process.env.ALIYUN_REGION",
        accessKeyId: "process.env.ALIYUN_AK",
        accessKeySecret: "process.env.ALIYUN_SK",
        bucket: "process.env.ALIYUN_BUCKET",

        // 或者七牛云配置
        // accessKey: "process.env.QINIU_AK",
        // secretKey: "process.env.QINIU_SK",
        // bucket: "process.env.QINIU_BUCKET",
        // region: "qiniu.zone.Zone_z2"
      }
    }),
    RedisConnectionModule

  ],
  controllers: [],
  providers: [
    {
      // 全局拦截器
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
  ],
})
export class AppModule { }
