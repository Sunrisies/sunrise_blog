import * as qiniu from 'qiniu';
import { CloudStorage } from './storage.interface';

export class QiniuOSS implements CloudStorage {
  private mac: qiniu.auth.digest.Mac;
  private config: qiniu.conf.Config;
  private bucketManager: qiniu.rs.BucketManager;
  private newConfig: { accessKey: string; secretKey: string; bucket: string; region: qiniu.conf.Zone };
  constructor(
    // @Inject('STORAGE_CONFIG')
    config: {
      accessKey: string;
      secretKey: string;
      bucket: string;
      region: qiniu.conf.Zone;
    }) {
    this.newConfig = config;
    this.mac = new qiniu.auth.digest.Mac(config.accessKey, config.secretKey);
    this.config = new qiniu.conf.Config();
  }

  async upload(newFile: Express.Multer.File, path: string) {
    const options = {
      scope: `${this.newConfig.bucket}:${path}`,
    };
    const file = newFile.buffer; // Assuming file is a Buffer object containing the file content
    const config = new qiniu.conf.Config();
    const formUploader = new qiniu.form_up.FormUploader(config);

    const putExtra = new qiniu.form_up.PutExtra();
    const putPolicy = new qiniu.rs.PutPolicy(options);
    const uploadToken = putPolicy.uploadToken(this.mac);
    return new Promise((resolve, reject) => {
      formUploader.put(uploadToken, path, file, putExtra, (err, body, info) => {
        if (err) {
          reject(err);
        }
        if (info.statusCode === 200) {
          const data = {
            url: `https://vip.chaoyang1024.top/${info.data.key}`,
            code: 200,
            storage_provider: 'qiniu',
          }
          resolve(data);
        } else {
          reject(body);
        }
      });
    })

  }



  async delete(filename: string): Promise<void> {
    // 实现删除逻辑
  }
}