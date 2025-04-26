import { DynamicModule, Module, Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AliyunOSS } from './aliyun.service';
import { QiniuOSS } from './qiniu.service';
import { StorageController } from './storage.controller';
import { CloudStorage } from './storage.interface';
export type StorageType = 'aliyun' | 'qiniu';
export interface StorageModuleOptions {
  type: StorageType;
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
