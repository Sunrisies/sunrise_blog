// src/storage/qiniu.provider.ts
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FileListResponse, FileResponse } from './storage.interface';
import { Storage } from './entities/storage.entity'; // 假设你有一个实体类来表示文件信息
import { PaginatedResponseDto, ResponseDto } from '@/types';
export class StorageService {
  constructor(@InjectRepository(Storage)
  private readonly storageRepository: Repository<Storage>) { }
  async create(fileInfo: {
    filename: string;
    path: string;
    size: string;
    type: string;
    storage_provider: string;
  }): Promise<Storage> {
    const record = this.storageRepository.create({
      path: fileInfo.path,
      title: fileInfo.filename,
      size: fileInfo.size,
      type: fileInfo.type,
      created_at: new Date(),
      storage_provider: fileInfo.storage_provider
    });
    return this.storageRepository.save(record);
  }


  async findAll(page: number, limit: number, type?: string): Promise<PaginatedResponseDto<Storage>> {
    const queryBuilder = this.storageRepository.createQueryBuilder('storage');

    if (type) {
      queryBuilder.where('storage.type LIKE :type', { type: `%${type}%` });
    }

    const total = await queryBuilder.getCount();
    const totalPage = Math.ceil(total / limit);

    if (page > totalPage && totalPage > 0) {
      return {
        code: 400,
        message: `请求页码超出范围，最大页数为 ${totalPage}`,
        data: null
      };
    }

    const files = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy('storage.created_at', 'DESC')
      .getMany();

    return {
      code: 200,
      data: {
        data: files,
        pagination: {
          page: page,
          limit: limit,
          total: total
        }
      },
      message: '获取成功'
    };
  }

  async delete(id: number): Promise<ResponseDto<null>> {
    const file = await this.storageRepository.findOne({ where: { id } });
    if (!file) {
      return { message: '当前文件不存在', code: 404, data: null } // 如果文件不存在，抛出错误
    }
    try {
      await this.storageRepository.delete(id);
    } catch (error) {
      return { message: '当前文件不存在', code: 404, data: null }
    }
    // 删除文件记录
    return { code: 200, message: '删除成功', data: null }; // 返回删除成功的消息
  }
}