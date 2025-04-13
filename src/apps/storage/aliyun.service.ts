import { Inject } from '@nestjs/common';
import { CloudStorage, FileListResponse, FileResponse } from './storage.interface';
import OSS from 'ali-oss';

export class AliyunOSS implements CloudStorage {
  private client: OSS;
  constructor(
    @Inject('STORAGE_CONFIG')
    private readonly config: {
      region: string;
      accessKeyId: string;
      accessKeySecret: string;
      bucket: string;
    }
  ) {
    // this.client = new OSS(this.config);
  }

  async upload(file: Express.Multer.File): Promise<FileResponse> {
    console.log('Received file:aliyun', file); // Log the file object to check its content and properties
    return {
      url: '',
      filename: '',
      size: 0,
      mimeType: ''
    }
  }

  async list(prefix?: string): Promise<FileListResponse> {

    return []
  }

  async delete(filename: string): Promise<void> {
  }
}