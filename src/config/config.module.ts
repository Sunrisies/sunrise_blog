import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}.local`,
      load: [
        () => {
          const env = process.env.NODE_ENV || 'development';
          const configPath = `${env === 'development' ? 'src' : 'src'}/config/config.${env}.yaml`;
          console.log(configPath, 'configPath---------');
          const configContent = require('fs').readFileSync(configPath, 'utf8');
          console.log(configContent, 'configContent');
          return { ...require('yaml').parse(configContent), env };
        },
      ],
    }),
  ],
  exports: [ConfigModule],
})
export class GlobalConfigModule {}
