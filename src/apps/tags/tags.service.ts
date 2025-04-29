import { Injectable } from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Tag } from './entities/tag.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TagsService {
  constructor(@InjectRepository(Tag)
  private tagsRepository: Repository<Tag>) { }
  async create(createTagDto: CreateTagDto) {
    // 先查询是否有该标签
    const findTag = await this.tagsRepository.findOne({ where: { name: createTagDto.name } });
    if (findTag) {
      return { message: "该标签已存在" };
    }
    try {
      const tag = await this.tagsRepository.create({
        name: createTagDto.name,
      });
      await this.tagsRepository.save(tag);
      return { data: tag, message: "创建成功" };
    } catch (error) {
      return { message: "创建失败" };
    }
  }

  async findAll(type?: 'article' | 'library') {
    const tags = await this.tagsRepository.find({
      where: { type: type || 'article' }
    });
    const tempTags = tags.map((tag) => {
      return { value: tag.id, label: tag.name };
    });
    return { data: { data: tempTags, pagination: {} }, };
  }

  findOne(id: number) {
    return `This action returns a #${id} tag`;
  }

  async update(id: number, updateTagDto: UpdateTagDto) {
    // 先查询是否有该标签
    const findTag = await this.tagsRepository.findOne({ where: { id: id } });
    if (!findTag) {
      return { message: "该标签不存在" };
    }
    // 更新的内容是否跟原本内容一样
    if (findTag.name === updateTagDto.name) {
      return { message: "更新内容与原本内容一致" };
    }
    // 更新改标签
    try {
      const tag = await this.tagsRepository.update({ id }, { name: updateTagDto.name });
      return { message: "更新成功" };
    } catch (error) {
      return { message: "更新失败" };
    }
  }

  async remove(id: number) {
    // 先查询是否有该标签
    const findTag = await this.tagsRepository.findOne({ where: { id: id } });
    if (!findTag) {
      return { message: "该标签不存在" };
    }
    // 删除该标签
    try {
      await this.tagsRepository.delete({ id });
      return { message: "删除成功" };
    } catch (error) {
      return { message: "删除失败" };
    }
  }
}
