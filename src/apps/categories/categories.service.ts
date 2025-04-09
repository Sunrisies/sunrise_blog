import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoriesService {
  constructor(@InjectRepository(Category)
  private categoryRepository: Repository<Category>) { }
  async create(createCategoryDto: CreateCategoryDto) {
    const findCategory = await this.categoryRepository.findOne({ where: { name: createCategoryDto.name } });
    if (findCategory) {
      return { message: "该分类已存在" };
    }
    try {
      const category = await this.categoryRepository.create({
        name: createCategoryDto.name,
        type: createCategoryDto.type || 'article'
      });
      await this.categoryRepository.save(category);
      return { data: category, message: "创建成功" };
    } catch (error) {
      return { message: "创建失败" };
    }
  }

  async findAll(type: 'article' | 'library') {
    const categories = await this.categoryRepository.find({
      where: { type: type || 'article' }
    });
    const tempCategories = categories.map((category) => {
      console.log(category);
      return { value: category.id, label: category.name };
    });
    return { data: tempCategories, message: "查询成功" };
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const findCategory = await this.categoryRepository.findOne({ where: { id: id } });
    if (!findCategory) {
      return { message: "该分类不存在" };
    }
    if (findCategory.name === updateCategoryDto.name) {
      return { message: "更新内容与原本内容一致" };
    }
    try {
      await this.categoryRepository.update({ id }, { name: updateCategoryDto.name });
      return { message: "更新成功" };
    } catch (error) {
      return { message: "更新失败" };
    }
  }

  async remove(id: number) {
    const findCategory = await this.categoryRepository.findOne({ where: { id: id } });
    if (!findCategory) {
      return { message: "该分类不存在" };
    }
    try {
      await this.categoryRepository.delete({ id });
      return { message: "删除成功" };
    } catch (error) {
      return { message: "删除失败" };
    }
  }
}
