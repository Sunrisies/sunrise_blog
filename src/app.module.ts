import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VisitLog } from './apps/visit-log/entities/visit-log.entity';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ArticleCommentsModule } from './apps/article-comments/article-comments.module';
import { ArticleModule } from './apps/article/article.module';
import { AuthModule } from './apps/auth/auth.module';
import { CategoriesModule } from './apps/categories/categories.module';
import { StorageModule } from './apps/storage/storage.module';
import { TagsModule } from './apps/tags/tags.module';
import { ThirdPartyLibraryModule } from './apps/third-party-library/third-party-library.module';
import { ToolsModule } from './apps/tools/tools.module';
import { UserModule } from './apps/user/user.module';
import { GlobalConfigModule } from './config/config.module';
import { MysqlConnectionModule } from './config/mysql.module';
import { RedisConnectionModule } from './config/redis.module';
import { TransformInterceptor } from './interceptor/transform.interceptor';
import { ConfigService } from '@nestjs/config';

import { VisitLogModule } from './apps/visit-log/visit-log.module';
import { MessageModule } from './apps/message/message.module';
@Module({
  imports: [
    GlobalConfigModule,
    MysqlConnectionModule,
    UserModule,
    AuthModule,
    TagsModule,
    CategoriesModule,
    ArticleModule,
    ArticleCommentsModule,
    ToolsModule,
    ThirdPartyLibraryModule,
    StorageModule.forRoot({
      type: 'qiniu',
      useFactory: (configService: ConfigService) => ({}), // 保留工厂函数结构,
      inject: [ConfigService]
    }),
    RedisConnectionModule,
    VisitLogModule,
    MessageModule
  ],
  controllers: [],
  providers: [
    {
      // 全局拦截器
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    }
  ],
})
export class AppModule {}
