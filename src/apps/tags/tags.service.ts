import { Injectable } from '@nestjs/common';
import { CreateTagDto, ITag } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Tag } from './entities/tag.entity';
import { Repository } from 'typeorm';
import { PaginatedResponseDto, ResponseDto } from '@/types';

@Injectable()
export class TagsService {
  constructor(@InjectRepository(Tag)
  private tagsRepository: Repository<Tag>) { }
  async create(createTagDto: CreateTagDto): Promise<ResponseDto<CreateTagDto>> {
    // 先查询是否有该标签
    const findTag = await this.tagsRepository.findOne({ where: { name: createTagDto.name } });
    if (findTag) {
      return { message: "该标签已存在", data: null };
    }
    try {
      const tag = await this.tagsRepository.create({
        name: createTagDto.name,
      });
      await this.tagsRepository.save(tag);
      return { data: tag, message: "创建成功" };
    } catch (error) {
      return { message: "创建失败", data: null };
    }
  }

  async findAll(type?: 'article' | 'library'): Promise<PaginatedResponseDto<ITag>> {
    const tags = await this.tagsRepository.find({
      where: { type: type || 'article' }
    });
    const tempTags = tags.map((tag) => {
      return { value: tag.id, label: tag.name };
    });
    return {
      code: 200,
      data: {
        data: tempTags, pagination: {
          total: tempTags.length,
          limit: tempTags.length,
          page: 1,
        }
      }, message: "获取成功"
    };
  }

  async update(id: number, updateTagDto: UpdateTagDto): Promise<ResponseDto<null>> {
    // 先查询是否有该标签
    const findTag = await this.tagsRepository.findOne({ where: { id: id } });
    if (!findTag) {
      return { message: "该标签不存在", data: null };
    }
    // 更新的内容是否跟原本内容一样
    if (findTag.name === updateTagDto.name) {
      return { message: "更新内容与原本内容一致", data: null };
    }
    // 更新改标签
    try {
      const tag = await this.tagsRepository.update({ id }, { name: updateTagDto.name });
      return { message: "更新成功", data: null };
    } catch (error) {
      return { message: "更新失败", data: null };
    }
  }

  async remove(id: number): Promise<ResponseDto<null>> {
    // 先查询是否有该标签
    const findTag = await this.tagsRepository.findOne({ where: { id: id } });
    if (!findTag) {
      return { message: "该标签不存在", data: null };
    }
    // 删除该标签
    try {
      await this.tagsRepository.delete({ id });
      return { message: "删除成功", data: null };
    } catch (error) {
      return { message: "删除失败", data: null };
    }
  }
}
