import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as Joi from 'joi';
import { Tag } from '../apps/tags/entities/tag.entity';
import { Article } from '../apps/article/entities/article.entity';
import { Category } from '../apps/categories/entities/category.entity';
import { ArticleComment } from '../apps/article-comments/entities/article-comment.entity';
import { ThirdPartyLibrary } from '../apps/third-party-library/entities/third-party-library.entity';
import { User } from '../apps/user/entities/user.entity';
import { Storage } from '../apps/storage/entities/storage.entity'
import { VisitLog } from '../apps/visit-log/entities/visit-log.entity';
import { Message } from '@/apps/message/entities/message.entity';
@Module({
  imports: [
    TypeOrmModule.forRootAsync(
      {
        useFactory: async (configService: ConfigService) => {
          // 验证配置
          const validationSchema = Joi.object({
            database: Joi.object({
              type: Joi.string().required(),
              host: Joi.alternatives().try(
                Joi.string().ip(), // 允许 IP 地址
                Joi.string().pattern(/^[a-zA-Z0-9-.]+\.[a-zA-Z]{2,}$/) // 允许域名
              ).required(),
              port: Joi.number().default(3306),
              username: Joi.string().pattern(/^[a-zA-Z0-9_]+$/).required(),
              password: Joi.string().required(),
              database: Joi.string().required(),
            }),
          });
          const config = {
            database: configService.get('database') // 从 ConfigService 获取 database configuratio
          }
          const { error, value } = validationSchema.validate(config);
          if (error) {
            throw new Error(`Config validation error: ${error.message}`);
          }
          return {
            type: value.database.type,
            host: value.database.host,
            port: value.database.port,
            username: value.database.username,
            password: value.database.password,
            database: value.database.database,
            entities: [Tag, Article, Category, User, ThirdPartyLibrary, ArticleComment, Storage, VisitLog, Message],
            synchronize: configService.get('env') === 'development',
            insecureAuth: true, // 允许旧版认证协议
            authSwitchHandler: (data, cb) => {
              if (data.pluginName === 'mysql_clear_password') {
                cb(null, Buffer.from(value.database.password + '\0'));
              }
            },
          };
        },
        inject: [ConfigService],
      }
    ),
  ],
  exports: [TypeOrmModule]
})
export class MysqlConnectionModule { }
