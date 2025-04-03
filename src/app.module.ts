import { Module } from '@nestjs/common';
import { UserModule } from './apps/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from './config/config';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './apps/auth/auth.module';
import { TagsModule } from './apps/tags/tags.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TransformInterceptor } from './interceptor/transform.interceptor';
import { CategoriesModule } from './apps/categories/categories.module';
import { ArticleModule } from './apps/article/article.module';
import { ArticleCommentsModule } from './apps/article-comments/article-comments.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}.local`,
    }),
    TypeOrmModule.forRootAsync(databaseConfig),
    UserModule,
    AuthModule,
    TagsModule,
    CategoriesModule,
    ArticleModule,
    ArticleCommentsModule],
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
