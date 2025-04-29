// src/storage/qiniu.provider.ts
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FileListResponse, FileResponse } from './storage.interface';
import { Storage } from './entities/storage.entity'; // 假设你有一个实体类来表示文件信息
export class StorageService {
  constructor(@InjectRepository(Storage)
  private readonly storageRepository: Repository<Storage>) { }
  async create(fileInfo: {
    filename: string;
    path: string;
    size: string;
    type: string;
  }) {
    const record = this.storageRepository.create({
      path: fileInfo.path,
      title: fileInfo.filename,
      size: fileInfo.size,
      type: fileInfo.type,
      created_at: new Date()
    });
    return this.storageRepository.save(record);
  }


  async findAll(page: number, limit: number) {
    // 获取所有媒体文件的总数
    const total = await this.storageRepository.count();
    const totalPage = Math.ceil(total / limit);
    // 直接检查原始页码
    if (page > totalPage && totalPage > 0) { // 添加 totalPage > 0 防止零数据误判
      return {
        code: 400,
        message: `请求页码超出范围，最大页数为 ${totalPage}`,
        data: null
      };
    }

    const startIndex = (page - 1) * limit;

    const files = await this.storageRepository.find({
      skip: startIndex,
      take: limit,
      order: { created_at: 'DESC' } // 按上传时间降序排列
    })
    return {
      data: {
        data: files,
        pagination: {
          page: page, // 当前页码
          limit: limit, // 每页显示的数量
          // total_pages: totalPage,
          total: total // 总数量
        }
      }
    };
  }

  async delete(id: number) {
    const file = await this.storageRepository.findOne({ where: { id } });
    if (!file) {
      return { message: '当前文件不存在', code: 404 } // 如果文件不存在，抛出错误
    }
    try {
      await this.storageRepository.delete(id);
    } catch (error) {
      return { message: '当前文件不存在', code: 404 }
    }
    // 删除文件记录
    return { code: 200, message: '删除成功' }; // 返回删除成功的消息
  }
}