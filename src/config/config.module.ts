// import * as fs from 'fs';
// import * as yaml from 'yaml';
// import { ConfigModule, ConfigService } from '@nestjs/config';
// import * as Joi from 'joi';
// import { Tag } from '../apps/tags/entities/tag.entity'

// export const databaseConfig = {
//     useFactory: async (configService: ConfigService) => {
//         // 验证配置
//         const validationSchema = Joi.object({
//             database: Joi.object({
//                 type: Joi.string().required(),
//                 host: Joi.alternatives().try(
//                     Joi.string().ip(), // 允许 IP 地址
//                     Joi.string().pattern(/^[a-zA-Z0-9-.]+\.[a-zA-Z]{2,}$/) // 允许域名
//                 ).required(),
//                 port: Joi.number().default(3306),
//                 username: Joi.string().pattern(/^[a-zA-Z0-9_]+$/).required(),
//                 password: Joi.string().required(),
//                 database: Joi.string().required(),
//             }),
//         });
//         const config = {
//             database: configService.get('database') // 从 ConfigService 获取 database configuratio
//         }
//         const { error, value } = validationSchema.validate(config);
//         if (error) {
//             throw new Error(`Config validation error: ${error.message}`);
//         }
//         return {
//             type: value.database.type,
//             host: value.database.host,
//             port: value.database.port,
//             username: value.database.username,
//             password: value.database.password,
//             database: value.database.database,
//             entities: [__dirname + '/../**/*.entity{.ts,.js}', Tag],
//             synchronize: configService.get('env') === 'development',
//         };
//     },
//     inject: [ConfigService],
// };
import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}.local`,
      load: [() => {
        const env = process.env.NODE_ENV || 'development';
        const configPath = `src/config/config.${env}.yaml`;
        const configContent = require('fs').readFileSync(configPath, 'utf8');
        return { ...require('yaml').parse(configContent), env };
      }],
    })
  ],
  exports: [ConfigModule]
})
export class GlobalConfigModule { }