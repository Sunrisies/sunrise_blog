import { DynamicModule, Module, Provider } from '@nestjs/common';
import { StorageController } from './storage.controller';
export type StorageType = 'aliyun' | 'qiniu';
import { CloudStorage } from './storage.interface';
import { AliyunOSS } from './aliyun.service';
import { QiniuOSS } from './qiniu.service';
import { ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
export interface StorageModuleOptions {
  type: StorageType;
  configuration?: any;
  useFactory?: (...args: any[]) => Promise<CloudStorage> | CloudStorage | any;
  inject?: any[];
}
@Module({
  controllers: [StorageController],
})
export class StorageModule {
  public static forRoot(options: StorageModuleOptions): DynamicModule {
    const providers: Provider[] = [
      {
        provide: 'CLOUD_STORAGE',
        useFactory: (configService: ConfigService) => {
          const config = {
            storage: configService.get('storage'),
          }
          const StorageClass = this.getStorageClass(config.storage.type);
          return new StorageClass(config.storage[config.storage.type]);
        },
        inject: [ConfigService]
      },
    ];

    return {
      global: true,
      module: StorageModule,
      providers,
      exports: ['CLOUD_STORAGE'],
    };
  }

  private static getStorageClass(type: StorageType) {
    const strategyMap = {
      aliyun: AliyunOSS,
      qiniu: QiniuOSS,
    };
    return strategyMap[type];
  }
}
