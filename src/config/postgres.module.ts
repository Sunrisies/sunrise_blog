import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as Joi from 'joi';
import { User } from '../apps/user/entities/user.entity'; // 保持实体导入
import { VisitLog } from '@/apps/visit-log/entities/visit-log.entity';
import { Session } from '@/apps/visit-log/entities/session.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      name:"postgres",
      useFactory: async (configService: ConfigService) => {
        const validationSchema = Joi.object({
          postgres: Joi.object({
            host: Joi.alternatives().try(
              Joi.string().ip(),
              Joi.string().hostname()
            ).required(),
            port: Joi.number().default(5432),
            username: Joi.string().required(),
            password: Joi.string().required(),
            database: Joi.string().required(),
          }),
        });

        const config = {
          postgres: configService.get('postgres')
        };

        const { error, value } = validationSchema.validate(config);
        if (error) {
          throw new Error(`Postgres config error: ${error.message}`);
        }

        return {
          type: 'postgres',
          host: value.postgres.host,
          port: value.postgres.port,
          username: value.postgres.username,
          password: value.postgres.password,
          database: value.postgres.database,
          entities: [VisitLog,Session], // 根据实际需要添加其他实体
          synchronize: configService.get('env') === 'development',
          ssl: configService.get('env') === 'production' ? {
            rejectUnauthorized: false
          } : false,
        };
      },
      inject: [ConfigService],
    }),
  ],
  exports: [TypeOrmModule]
})
export class PgConnectionModule { }