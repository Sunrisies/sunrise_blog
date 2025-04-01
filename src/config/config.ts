import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from '../apps/user/entities/user.entity';

export const databaseConfig = {
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: `.env.${process.env.NODE_ENV || 'development'}.local`,
        }),
    ],
    useFactory: async (configService: ConfigService) => {
        return {
            type: 'mysql' as any,
            host: 'api.chaoyang1024.top',
            port: 9906,
            username: 'root',
            password: 'zhuzhongqian@123456',
            database: 'test_db',
            entities: [User],
            synchronize: false
        };
    },
    inject: [ConfigService],
};