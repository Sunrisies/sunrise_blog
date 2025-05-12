import { Injectable } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Article } from './entities/article.entity';
import { Repository } from 'typeorm';
import { Category } from '../categories/entities/category.entity';
import { Tag } from '../tags/entities/tag.entity';
import { PaginatedResponseDto, ResponseDto } from '@/types';
const DEFAULT_COVERS = {
  1: "https://vip.chaoyang1024.top/img/前端.png",
  2: "https://vip.chaoyang1024.top/img/运维.png",
  3: "https://vip.chaoyang1024.top/img/后端.png",
  4: "https://vip.chaoyang1024.top/img/dokcer.png", // category_id 为 1 时使用
  5: "https://vip.chaoyang1024.top/img/js.png", // category_id 为 2 时使用
  6: "https://vip.chaoyang1024.top/img/react.png", // category_id 为 3 时使用
  7: "https://vip.chaoyang1024.top/img/vue.png", // category_id 为 4 时使用
};
@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private articleRepository: Repository<Article>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>
  ) { }
  async create(createArticleDto: CreateArticleDto): Promise<ResponseDto<Article>> {
    // 先检测当前标题是否存在
    const isExist = await this.articleRepository.findOne({ where: { title: createArticleDto.title } });
    if (isExist) {
      return { code: 400, message: '标题已存在', data: null };
    }
    // 处理分类关联
    const category = await this.categoryRepository.findOne({
      select: ['id', 'name'],
      where: { id: createArticleDto.categoryId }
    });
    if (!category) {
      throw new Error('分类不存在');
    }
    if (!createArticleDto.cover) {
      const defaultCover = DEFAULT_COVERS[createArticleDto.categoryId];
      if (!defaultCover) {
        return { code: 400, message: '未找到默认封面', data: null };
        // throw new CustomException("未找到默认封面", HttpStatus.INTERNAL_SERVER_ERROR);
      }
      createArticleDto.cover = defaultCover; // 设置默认封面
    }
    // 处理标签关联
    const tags = await Promise.all(
      createArticleDto.tagIds.map(tagId =>
        this.tagRepository.findOne({ select: ['id', 'name'], where: { id: tagId } })
      )
    );
    if (tags.some(tag => !tag)) {
      return { code: 400, message: '包含不存在的标签', data: null }; // 或者抛出错误，取决于你的业务逻辑
    }
    try {
      const article = this.articleRepository.create({
        ...createArticleDto, category,
        tags
      });
      await this.articleRepository.save(article);
      return { message: '创建成功', data: article };
    } catch (error) {
      return { code: 500, message: '创建失败', data: null };
    }
  }

  async findAll(page: number, limit: number, filters?: {
    category?: string;
    tag?: string;
    title?: string;
  }): Promise<PaginatedResponseDto<Article>> {
    // 首先获取所有文章
    const total = await this.articleRepository.count();
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
      const queryBuilder = this.articleRepository
        .createQueryBuilder('article')
        .leftJoinAndSelect('article.category', 'category')
        .leftJoinAndSelect('article.tags', 'tags')
        .select([
          'article',
          'category.id',
          'category.name',
          'tags.id',
          'tags.name'
        ])
      // 动态添加筛选条件
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
        queryBuilder.andWhere('article.title LIKE :title', {
          title: `%${filters.title}%`
        });
      }
      queryBuilder
        .skip(startIndex)
        .take(limit);

      const articles = await queryBuilder.getMany();
      // 获取筛选后的总数量
      const total = await queryBuilder.getCount();
      const totalPage = Math.ceil(total / limit);
      return {
        code: 200,
        data: {
          data: articles,
          pagination: {
            page: page, // 当前页码
            limit: limit, // 每页显示的数量
            // total_pages: totalPage,
            total: total // 总数量
          }
        }
      };
    } catch (error) {
      return { code: 500, message: '获取文章失败', data: null };
    }
  }

  async findOne(id: number): Promise<ResponseDto<Article>> {
    try {
      const queryBuilder = this.articleRepository
        .createQueryBuilder('article')
        .leftJoinAndSelect('article.category', 'category')
        .leftJoinAndSelect('article.tags', 'tags')
        .select([
          'article',
          'category.id',
          'category.name',
          'tags.id',
          'tags.name'
        ])
        .where('article.id = :id', { id });

      const article = await queryBuilder.getOne();

      if (!article) {
        return { code: 404, message: '文章未找到', data: null };
      }

      // 更新浏览量
      await this.articleRepository.update(id, { views: () => 'views + 1' });

      return {
        code: 200,
        data: article,
        message: '获取文章成功'
      };
    } catch (error) {
      console.error(error);
      return { code: 500, message: '获取文章详情失败', data: null };
    }
  }
  // 根据时间来生成数据
  async getUploadTime() {
    try {
      const results = await this.articleRepository
        .createQueryBuilder('article')
        .select([
          "DATE_FORMAT(article.publish_time, '%Y-%m-%d') as date",
          "COUNT(*) as count"
        ])
        .groupBy('date')
        .orderBy('date', 'DESC')
        .getRawMany();

      // 转换结果为要求的数组格式
      const formatted = results.map(item => [item.date, parseInt(item.count)]);

      return {
        code: 200,
        data: formatted
      };
    } catch (error) {
      console.error('获取上传时间分布失败:', error);
      return {
        code: 500,
        data: [],
        message: '获取数据失败'
      };
    }
  }

  // 获取文章的上一篇和下一篇
  async getPrevNext(id: number) {
    try {
      // 获取当前文章信息
      const currentArticle = await this.articleRepository.findOne({
        where: { id },
        select: ['id', 'publish_time']
      });

      if (!currentArticle) {
        return { code: 404, message: '文章未找到' };
      }

      // 查询上一篇（时间更早的文章）
      const prevArticle = await this.articleRepository
        .createQueryBuilder('article')
        .select(['article.id', 'article.title'])
        .where('article.publish_time < :currentTime', { currentTime: currentArticle.publish_time })
        .orderBy('article.publish_time', 'DESC')
        .addOrderBy('article.id', 'DESC')
        .getOne();

      // 查询下一篇（时间更晚的文章）
      const nextArticle = await this.articleRepository
        .createQueryBuilder('article')
        .select(['article.id', 'article.title'])
        .where('article.publish_time > :currentTime', { currentTime: currentArticle.publish_time })
        .orderBy('article.publish_time', 'ASC')
        .addOrderBy('article.id', 'ASC')
        .getOne();

      return {
        code: 200,
        data: {
          prevArticle: prevArticle || null,
          nextArticle: nextArticle || null
        }
      };
    } catch (error) {
      console.error('获取相邻文章失败:', error);
      return {
        code: 500,
        message: '获取相邻文章失败',
        data: {
          prevArticle: null,
          nextArticle: null
        }
      };
    }
  }

  async update(id: number, updateArticleDto: UpdateArticleDto) {
    try {
      const article = await this.articleRepository.findOne({
        where: { id },
        relations: ['category', 'tags']
      });

      if (!article) {
        return { code: 404, message: '文章未找到' };
      }

      // 处理分类更新
      if (updateArticleDto.categoryId) {
        const newCategory = await this.categoryRepository.findOne({
          where: { id: updateArticleDto.categoryId }
        });
        if (!newCategory) {
          return { code: 400, message: '分类不存在' };
        }
        article.category = newCategory;
      }

      // 处理标签更新
      if (updateArticleDto.tagIds) {
        const tags = await Promise.all(
          updateArticleDto.tagIds.map(tagId =>
            this.tagRepository.findOne({ where: { id: tagId } })
          )
        );
        if (tags.some(tag => !tag)) {
          return { code: 400, message: '包含不存在的标签' };
        }

        // 先解除旧关联
        await this.articleRepository
          .createQueryBuilder()
          .relation(Article, 'tags')
          .of(id)
          .remove(article.tags.map(t => t.id));

        // 添加新关联
        await this.articleRepository
          .createQueryBuilder()
          .relation(Article, 'tags')
          .of(id)
          .add(tags.map(t => t.id));
      }

      // 合并更新数据
      this.articleRepository.merge(article, updateArticleDto);

      // 保存更新
      await this.articleRepository.save(article);

      return {
        code: 200,
        message: '更新成功',
      };
    } catch (error) {
      console.error('更新文章失败:', error);
      return { code: 500, message: '更新失败' };
    }
  }

  async remove(id: number) {
    try {
      const article = await this.articleRepository.findOne({
        where: { id },
        relations: ['category', 'tags']
      });

      if (!article) {
        return { code: 404, message: '文章未找到' };
      }

      // 先解除关联关系（针对多对多关系）
      await this.articleRepository
        .createQueryBuilder()
        .relation(Article, 'tags')
        .of(id)
        .remove(article.tags.map(tag => tag.id));

      // 再删除文章
      await this.articleRepository.remove(article);

      return {
        code: 200,
        message: '删除成功',
        data: {
          id: article.id,
          title: article.title
        }
      };
    } catch (error) {
      console.error('删除文章失败:', error);
      return {
        code: 500,
        message: '删除失败',
        data: null
      };
    }
  }
  // 时间轴
  async getTimeline() {
    try {
      const articles = await this.articleRepository
        .createQueryBuilder('article')
        .leftJoinAndSelect('article.tags', 'tags')
        .select([
          'article.id',
          'article.title',
          'article.description',
          'article.publish_time',
          'article.cover',
          'tags.id',
          'tags.name'
        ])
        .orderBy('article.publish_time', 'DESC')
        .getMany();

      return {
        code: 200,
        data: { data: articles }
      };
    } catch (error) {
      console.error('获取时间轴数据失败:', error);
      return {
        code: 500,
        data: [],
        message: '获取数据失败'
      };
    }
  }
}
