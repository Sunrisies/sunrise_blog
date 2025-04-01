import { Module } from '@nestjs/common';
import { UserModule } from './apps/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from './config/config';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './apps/auth/auth.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}.local`,
    }),
    TypeOrmModule.forRootAsync(databaseConfig),
    UserModule,
    AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule { }
