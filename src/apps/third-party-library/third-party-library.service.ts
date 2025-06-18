import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateThirdPartyLibraryDto } from './dto/create-third-party-library.dto';
import { UpdateThirdPartyLibraryDto } from './dto/update-third-party-library.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ThirdPartyLibrary } from './entities/third-party-library.entity';
import { Repository } from 'typeorm';
import { Category } from '../categories/entities/category.entity';
import { Tag } from '../tags/entities/tag.entity';
import { PaginatedResponseDto, ResponseDto } from '@/types';

@Injectable()
export class ThirdPartyLibraryService {
  constructor(
    @InjectRepository(ThirdPartyLibrary)
    private libraryRepository: Repository<ThirdPartyLibrary>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(Tag)
    private tagRepository: Repository<Tag>,
  ) {}
  async create(
    createThirdPartyLibraryDto: CreateThirdPartyLibraryDto,
  ): Promise<ResponseDto<CreateThirdPartyLibraryDto>> {
    try {
      // 检查是否有重复的名称
      const existingLibrary = await this.libraryRepository.findOne({
        where: { name: createThirdPartyLibraryDto.name },
      });
      if (existingLibrary) {
        return { message: '名称已存在', data: null };
      }
      // 获取并验证分类
      const category = createThirdPartyLibraryDto.categoryId
        ? await this.categoryRepository.findOne({
            where: { id: createThirdPartyLibraryDto.categoryId },
          })
        : null;

      // 验证标签存在性
      const tagIds = createThirdPartyLibraryDto.tagIds || [];
      const tags =
        tagIds.length > 0 ? await this.tagRepository.findByIds(tagIds) : [];

      // 详细错误检查
      if (createThirdPartyLibraryDto.categoryId && !category) {
        return {
          message: `ID为 ${createThirdPartyLibraryDto.categoryId} 的分类不存在`,
          data: null,
        };
      }

      if (tagIds.length > 0 && tags.length !== tagIds.length) {
        const missingTags = tagIds.filter(
          (id) => !tags.some((t) => t.id === id),
        );
        return {
          message: `以下标签不存在: ${missingTags.join(', ')}`,
          data: null,
        };
      }
      // 如果都有那么开始保存数据
      const library = this.libraryRepository.create({
        ...createThirdPartyLibraryDto,
        category,
        tags,
      });
      await this.libraryRepository.save(library);
      return { message: '创建成功', data: library }; // 返回保存后的实体，或者 { message: }
    } catch (error) {
      console.error('创建第三方库时出错:', error);
      throw new BadRequestException('创建第三方库时出错');
    }
  }

  async findAll(
    page: number,
    limit: number,
    filters?: {
      categoryId?: string;
      tag?: string;
      name?: string;
    },
  ): Promise<PaginatedResponseDto<ThirdPartyLibrary>> {
    // 首先获取所有第三库的数量
    const total = await this.libraryRepository.count();
    const totalPage = Math.ceil(total / limit);
    // 直接检查原始页码
    if (page > totalPage && totalPage > 0) {
      // 添加 totalPage > 0 防止零数据误判
      return {
        code: 400,
        message: `请求页码超出范围，最大页数为 ${totalPage}`,
        data: null,
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
          'tags.name',
        ]);

      // 修改筛选条件
      if (filters?.categoryId) {
        queryBuilder.andWhere('category.id = :categoryId', {
          categoryId: Number(filters.categoryId),
        });
      }

      if (filters?.tag) {
        queryBuilder.andWhere('tags.id = :tagId', {
          tagId: Number(filters.tag),
        });
      }

      if (filters?.name) {
        queryBuilder.andWhere('library.name LIKE :name', {
          name: `%${filters.name}%`,
        });
      }
      queryBuilder.skip(startIndex).take(limit);

      const articles = await queryBuilder.getMany();
      // 获取筛选后的总数量
      const total = await queryBuilder.getCount();
      return {
        code: 200,
        data: {
          data: articles,
          pagination: {
            page: page, // 当前页码
            limit: limit, // 每页显示的数量
            total: total, // 总数量
          },
        },
        message: '获取第三方库成功',
      };
    } catch (error) {
      return { code: 500, message: '获取第三方库失败', data: null };
    }
  }

  async update(
    id: number,
    updateThirdPartyLibraryDto: UpdateThirdPartyLibraryDto,
  ): Promise<ResponseDto<UpdateThirdPartyLibraryDto>> {
    // 先获取要更新的库
    const existingLibrary = await this.libraryRepository.findOne({
      where: { id },
      relations: ['category', 'tags'], // 加载关联关系
    });

    if (!existingLibrary) {
      return { message: '库不存在', data: null };
    }

    try {
      // 检查名称冲突（排除自身）
      if (
        updateThirdPartyLibraryDto.name &&
        updateThirdPartyLibraryDto.name !== existingLibrary.name
      ) {
        const nameExists = await this.libraryRepository.exist({
          where: { name: updateThirdPartyLibraryDto.name },
        });
        if (nameExists) {
          return { message: '名称已存在', data: null };
        }
      }

      // 更新分类关系
      if (updateThirdPartyLibraryDto.categoryId) {
        existingLibrary.category = await this.categoryRepository.findOneBy({
          id: updateThirdPartyLibraryDto.categoryId,
        });
      }

      // 更新标签关系
      if (updateThirdPartyLibraryDto.tagIds) {
        existingLibrary.tags = await this.tagRepository.findByIds(
          updateThirdPartyLibraryDto.tagIds,
        );
      }

      // 合并其他字段
      this.libraryRepository.merge(existingLibrary, updateThirdPartyLibraryDto);

      // 保存更新
      const updatedLibrary = await this.libraryRepository.save(existingLibrary);
      return {
        message: '修改成功',
        data: updatedLibrary,
      };
    } catch (error) {
      console.error('修改第三方库时出错:', error);
      throw new BadRequestException('修改第三方库时出错');
    }
  }

  async remove(id: number): Promise<ResponseDto<null>> {
    // 检查库是否存在
    const existingLibrary = this.libraryRepository.findOne({ where: { id } });
    if (!existingLibrary) {
      return { message: '库不存在', data: null };
    }
    // 删除库
    try {
      await this.libraryRepository.delete(id);
      return { message: '删除成功', data: null };
    } catch (error) {
      console.error('删除第三方库时出错:', error);
      throw new BadRequestException('删除第三方库时出错');
    }
  }
}
