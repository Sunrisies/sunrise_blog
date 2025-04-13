import { DynamicModule, Module, Provider } from '@nestjs/common';
import { StorageController } from './storage.controller';
export type StorageType = 'aliyun' | 'qiniu';
import { CloudStorage } from './storage.interface';
import { AliyunOSS } from './aliyun.service';
import { QiniuOSS } from './qiniu.service';
export interface StorageModuleOptions {
  type: StorageType;
  configuration: any;
}
@Module({
  controllers: [StorageController],
  // providers: [StorageService],
})
export class StorageModule {
  static forRoot(options: StorageModuleOptions): DynamicModule {
    console.log(options.configuration, 'options');

    const providers: Provider[] = [
      // 更清晰的依赖注入配置
      {
        // 由于 CloudStorage 是类型，不能直接作为值使用，这里用一个字符串常量替代
        provide: 'CLOUD_STORAGE',
        useClass: this.getStorageClass(options.type), // 动态选择实现类
      },
      {
        provide: 'STORAGE_CONFIG',
        useValue: options.configuration,
      }
    ];

    return {
      global: true, // 可选设置为全局模块
      module: StorageModule,
      providers,
      // 由于 CloudStorage 是类型，不能直接作为值导出，这里用之前定义的字符串常量 'CLOUD_STORAGE' 替代
      exports: ['CLOUD_STORAGE', 'STORAGE_CONFIG'],
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
