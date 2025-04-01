import { Module } from '@nestjs/common';
import { UserModule } from './apps/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from './config/config';
import { ConfigModule } from '@nestjs/config';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}.local`,
    }),
    TypeOrmModule.forRootAsync(databaseConfig),
    UserModule],
  controllers: [],
  providers: [],
})
export class AppModule { }
