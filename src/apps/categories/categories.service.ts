import { PaginatedResponseDto, ResponseDto } from '@/types'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CreateCategoryDto, ICategory } from './dto/create-category.dto'
import { UpdateCategoryDto } from './dto/update-category.dto'
import { Category } from './entities/category.entity'

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>
  ) { }
  async create(createCategoryDto: CreateCategoryDto): Promise<ResponseDto<CreateCategoryDto>> {
    const findCategory = await this.categoryRepository.findOne({
      where: { name: createCategoryDto.name }
    })
    if (findCategory) {
      return { message: '该分类已存在', data: null }
    }
    try {
      const category = await this.categoryRepository.create({
        name: createCategoryDto.name,
        type: createCategoryDto.type || 'article'
      })
      await this.categoryRepository.save(category)
      return { data: category, message: '创建成功' }
    } catch (error) {
      console.error('创建分类失败:', error)
      return { message: '创建失败', data: null }
    }
  }

  async findAll(type: 'article' | 'library'): Promise<PaginatedResponseDto<ICategory>> {
    const categories = await this.categoryRepository.find({
      where: { type: type || 'article' }
    })
    const tempCategories = categories.map((category) => {
      return { value: category.id, label: category.name }
    })
    return {
      code: 200,
      data: {
        data: tempCategories,
        pagination: {
          total: categories.length,
          limit: categories.length,
          page: 1
        }
      },
      message: '查询成功'
    }
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto): Promise<ResponseDto<null>> {
    const findCategory = await this.categoryRepository.findOne({
      where: { id: id }
    })
    if (!findCategory) {
      return { message: '该分类不存在', data: null }
    }
    if (findCategory.name === updateCategoryDto.name) {
      return { message: '更新内容与原本内容一致', data: null }
    }
    try {
      await this.categoryRepository.update({ id }, { name: updateCategoryDto.name })
      return { message: '更新成功', data: null }
    } catch (error) {
      console.error('更新分类失败:', error)
      return { message: '更新失败', data: null }
    }
  }

  async remove(id: number): Promise<ResponseDto<null>> {
    const findCategory = await this.categoryRepository.findOne({
      where: { id: id }
    })
    if (!findCategory) {
      return { message: '该分类不存在', data: null }
    }
    try {
      await this.categoryRepository.delete({ id })
      return { message: '删除成功', data: null }
    } catch (error) {
      console.error('删除分类失败:', error)
      return { message: '删除失败', data: null }
    }
  }
  // 
  async getCategoryList({ type, page, limit }: {
    type: 'article' | 'library',
    page: number,
    limit: number
  }): Promise<any> {
    // 分类查询
    const queryBuilder = this.categoryRepository.createQueryBuilder('category')
    type && queryBuilder.where('category.type = :type', { type })
    queryBuilder.skip((page - 1) * limit)
    queryBuilder.take(limit)
    const categories = await queryBuilder.getMany()
    const total = await queryBuilder.getCount()
    const totalPage = Math.ceil(total / limit)
    // 直接检查原始页码
    if (page > totalPage && totalPage > 0) {
      // 添加 totalPage > 0 防止零数据误判
      return {
        code: 400,
        message: `请求页码超出范围，最大页数为 ${totalPage}`,
        data: null
      }
    }
    const startIndex = (page - 1) * limit
    return {
      code: 200,
      data: {
        data: categories,
        pagination: {
          total,
          limit,
          page
        }
      },
      message: '查询成功'
    }
  }
}
