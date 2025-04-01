import * as fs from 'fs';
import * as yaml from 'yaml';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import path from 'node:path';

export const databaseConfig = {
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: `.env.${process.env.NODE_ENV || 'development'}.local`,
        }),
    ],
    useFactory: async (configService: ConfigService) => {
        // 加载 YAML 文件
        const env = configService.get<string>('NODE_ENV');
        const configPath = `src/config/config.${env}.yaml`;
        const configContent = fs.readFileSync(configPath, 'utf8');
        const config = yaml.parse(configContent);
        console.log(config, 'config')
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
            entities: [__dirname + '/../**/*.entity{.ts,.js}'],
            synchronize: env === 'development',
        };
    },
    inject: [ConfigService],
};