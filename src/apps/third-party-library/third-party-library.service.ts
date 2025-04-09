import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateThirdPartyLibraryDto } from './dto/create-third-party-library.dto';
import { UpdateThirdPartyLibraryDto } from './dto/update-third-party-library.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ThirdPartyLibrary } from './entities/third-party-library.entity';
import { Repository } from 'typeorm';
import { Category } from '../categories/entities/category.entity';
import { Tag } from '../tags/entities/tag.entity';

@Injectable()
export class ThirdPartyLibraryService {
  constructor(
    @InjectRepository(ThirdPartyLibrary)
    private libraryRepository: Repository<ThirdPartyLibrary>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(Tag)
    private tagRepository: Repository<Tag>
  ) { }
  async create(createThirdPartyLibraryDto: CreateThirdPartyLibraryDto) {
    try {
      // 检查是否有重复的名称
      const existingLibrary = await this.libraryRepository.findOne({ where: { name: createThirdPartyLibraryDto.name } });
      if (existingLibrary) {
        return { message: '名称已存在' };
      }
      // 获取并验证分类
      const category = createThirdPartyLibraryDto.categoryId
        ? await this.categoryRepository.findOne({ where: { id: createThirdPartyLibraryDto.categoryId } })
        : null;

      // 验证标签存在性
      const tagIds = createThirdPartyLibraryDto.tagIds || [];
      const tags = tagIds.length > 0
        ? await this.tagRepository.findByIds(tagIds)
        : [];

      // 详细错误检查
      if (createThirdPartyLibraryDto.categoryId && !category) {
        return { message: `ID为 ${createThirdPartyLibraryDto.categoryId} 的分类不存在` }
      }

      if (tagIds.length > 0 && tags.length !== tagIds.length) {
        const missingTags = tagIds.filter(id => !tags.some(t => t.id === id));
        return { message: `以下标签不存在: ${missingTags.join(', ')}` }
      }
      // 如果都有那么开始保存数据
      const library = this.libraryRepository.create({ ...createThirdPartyLibraryDto, category, tags });
      await this.libraryRepository.save(library);
      return { message: '创建成功', data: library }; // 返回保存后的实体，或者 { message: }
    } catch (error) {
      console.error('创建第三方库时出错:', error);
      throw new BadRequestException('创建第三方库时出错');
    }

  }

  async findAll(page: number, limit: number, filters?: {
    category?: string;
    tag?: string;
    title?: string;
  }) {
    // 首先获取所有第三库的数量
    const total = await this.libraryRepository.count();
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
    try {
      const queryBuilder = this.libraryRepository
        .createQueryBuilder('library')
        .leftJoinAndSelect('library.category', 'category')
        .leftJoinAndSelect('library.tags', 'tags')
        .select([
          'library',
          'category.id',
          'category.name',
          'tags.id',
          'tags.name'
        ]);

      // 修改筛选条件
      if (filters?.category) {
        queryBuilder.andWhere('category.id = :categoryId', {
          categoryId: Number(filters.category)
        });
      }

      if (filters?.tag) {
        queryBuilder.andWhere('tags.id = :tagId', {
          tagId: Number(filters.tag)
        });
      }

      if (filters?.title) {
        queryBuilder.andWhere('library.name LIKE :name', {
          name: `%${filters.title}%`
        });
      }
      queryBuilder
        .skip(startIndex)
        .take(limit);

      const articles = await queryBuilder.getMany();
      // 获取筛选后的总数量
      const total = await queryBuilder.getCount();
      return {
        code: 200,
        data: {
          data: articles,
          pagination: {
            page: page, // 当前页码
            imit: limit, // 每页显示的数量
            total: total // 总数量
          }
        }
      };
    } catch (error) {
      return { code: 500, message: '获取文章失败' };
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} thirdPartyLibrary`;
  }

  update(id: number, updateThirdPartyLibraryDto: UpdateThirdPartyLibraryDto) {
    return `This action updates a #${id} thirdPartyLibrary`;
  }

  remove(id: number) {
    return `This action removes a #${id} thirdPartyLibrary`;
  }
}
