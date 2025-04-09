import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from '../apps/user/entities/user.entity';
import { Tag } from '../apps/tags/entities/tag.entity'
import { Category } from '../apps/categories/entities/category.entity'; // 确保这个路径正确，并且包含了你的实体文件。
import { Article } from '../apps/article/entities/article.entity';
import { ThirdPartyLibrary } from '../apps/third-party-library/entities/third-party-library.entity';
import { ArticleComment } from '../apps/article-comments/entities/article-comment.entity';
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
            entities: [User, Tag, Category, Article, ThirdPartyLibrary, ArticleComment],
            synchronize: false
        };
    },
    inject: [ConfigService],
};