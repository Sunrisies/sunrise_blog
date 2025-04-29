import { Inject } from '@nestjs/common';
import { CloudStorage, FileListResponse, FileResponse } from './storage.interface';
import OSS from 'ali-oss';
import { fileSizeInBytes } from "../../utils";
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
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
    console.log('Received config:aliyun', config); // Log the config object to check its content and properties
    this.client = new OSS(this.config);
    console.log(this.client, '=============');
  }

  async upload(file: Express.Multer.File, path: string) {

    try {
      const result = await this.client.put(path, file.buffer);
      console.log("uploadFile result", result);
      return { url: result.url, name: result.name, code: 200 };
    } catch (error) {
      throw new Error("Failed to upload file");
    }

  }

  async list(page: number, limit: number): Promise<FileListResponse> {

    return []
  }

  async delete(filename: string): Promise<void> {
  }
}