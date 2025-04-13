// src/storage/qiniu.provider.ts
import { Inject } from '@nestjs/common';
import { CloudStorage, FileListResponse, FileResponse } from './storage.interface';
import * as qiniu from 'qiniu';

export class QiniuOSS implements CloudStorage {
  private mac: qiniu.auth.digest.Mac;
  private config: qiniu.conf.Config;
  private bucketManager: qiniu.rs.BucketManager;

  constructor(
    @Inject('STORAGE_CONFIG')

    config: {
      accessKey: string;
      secretKey: string;
      bucket: string;
      region: qiniu.conf.Zone;
    }) {
    // this.mac = new qiniu.auth.digest.Mac(config.accessKey, config.secretKey);
    // this.config = new qiniu.conf.Config({ zone: config.region });
    // this.bucketManager = new qiniu.rs.BucketManager(this.mac, this.config);
  }

  async upload(file: Express.Multer.File): Promise<FileResponse> {
    const filename = `${Date.now()}-${file.originalname}`;
    console.log('Received file:qiniu', file); // Log the file object
    return {
      url: "",
      filename: "",
      size: file.size,
      mimeType: file.mimetype
    };
  }

  async list(prefix?: string): Promise<FileListResponse> {
    // 实现列表逻辑
    return []
  }

  async delete(filename: string): Promise<void> {
    // 实现删除逻辑
  }
}