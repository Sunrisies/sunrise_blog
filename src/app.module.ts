import { Module } from '@nestjs/common';
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
import { GlobalConfigModule } from './config/config.modules';
import { MysqlConnectionModule } from './config/mysql.modules';
import { RedisConnectionModule } from './config/redis.module';
import { TransformInterceptor } from './interceptor/transform.interceptor';
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
