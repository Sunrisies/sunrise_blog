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
        const configPath = `${env === 'development' ? 'src' : "dist"}/config/config.${env}.yaml`;
        const configContent = require('fs').readFileSync(configPath, 'utf8');
        return { ...require('yaml').parse(configContent), env };
      }],
    })
  ],
  exports: [ConfigModule],
})
export class GlobalConfigModule { }