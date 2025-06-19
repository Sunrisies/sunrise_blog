import { Inject } from '@nestjs/common'
import OSS from 'ali-oss'
import { CloudStorage } from './storage.interface'
export class AliyunOSS implements CloudStorage {
  private client: OSS
  constructor(
    @Inject('STORAGE_CONFIG')
    private readonly config: {
      region: string
      accessKeyId: string
      accessKeySecret: string
      bucket: string
    }
  ) {
    this.client = new OSS(this.config)
  }

  async upload(file: Express.Multer.File, path: string) {
    try {
      const result = await this.client.put(path, file.buffer)
      return {
        url: result.url,
        name: result.name,
        code: 200,
        storage_provider: 'aliyun'
      }
    } catch (error) {
      console.error('Aliyun OSS 上传失败:', error)
      return { url: '', name: '', code: 400 } // 处理上传错误，返回空对象或其他错误信息
    }
  }
}
