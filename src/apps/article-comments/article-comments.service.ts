import { Injectable } from '@nestjs/common';
import { CreateArticleCommentDto } from './dto/create-article-comment.dto';
import { UpdateArticleCommentDto } from './dto/update-article-comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ArticleComment } from './entities/article-comment.entity';
import { Article } from '../article/entities/article.entity';
import { User } from '../user/entities/user.entity';
@Injectable()
export class ArticleCommentsService {
  constructor(@InjectRepository(ArticleComment)
  private articleCommentRepository: Repository<ArticleComment>,
    @InjectRepository(Article)
    private articleRepository: Repository<Article>,
    @InjectRepository(User)
    private userRepository: Repository<User>) { }
  async create(createArticleCommentDto: CreateArticleCommentDto) {
    try {
      // 验证文章存在
      const article = await this.articleRepository.findOne({
        where: { id: createArticleCommentDto.articleId }
      });
      if (!article) {
        return { code: 404, message: '关联文章不存在' };
      }

      // 验证用户存在（如果提供了用户ID）
      let user: User = null;
      if (createArticleCommentDto.userId) {
        user = await this.userRepository.findOne({
          where: { id: createArticleCommentDto.userId }
        });
        if (!user) {
          return { code: 404, message: '用户不存在' };
        }
      }

      // 处理父级评论
      let parentComment: ArticleComment = null;
      if (createArticleCommentDto.parentId) {
        parentComment = await this.articleCommentRepository.findOne({
          where: { id: createArticleCommentDto.parentId },
          relations: ['article']
        });
        if (!parentComment) {
          return { code: 404, message: '父级评论不存在' };
        }
        if (parentComment.article.id !== article.id) {
          return { code: 400, message: '不能回复其他文章的评论' };
        }
      }

      // 创建评论对象
      const newComment = this.articleCommentRepository.create({
        content: createArticleCommentDto.content,
        article,
        user,
        parent: parentComment,
        nickname: createArticleCommentDto.nickname,
        email: createArticleCommentDto.email
      });

      // 保存到数据库
      const savedComment = await this.articleCommentRepository.save(newComment);
      return {
        code: 200,
        message: '评论创建成功',
        data: {
          ...savedComment,
          parent: parentComment ? {
            id: parentComment.id,
            content: parentComment.content
          } : null
        }
      };
    } catch (error) {
      console.error('创建评论失败:', error);
      return { code: 500, message: '评论创建失败' };
    }
  }
  // ... existing code ...

  async findAllForAdmin(page: number = 1, limit: number = 10) {
    try {
      const skip = (page - 1) * limit;
      const queryBuilder = this.articleCommentRepository
        .createQueryBuilder('comment')
        .leftJoinAndSelect('comment.article', 'article')
        .leftJoinAndSelect('comment.user', 'user')
        .orderBy('comment.created_at', 'DESC')
        .skip(skip)
        .take(limit);

      const [comments, total] = await queryBuilder.getManyAndCount();

      // 格式化管理端需要的数据
      const formatted = comments.map(comment => ({
        id: comment.id,
        content: comment.content,
        created_at: comment.created_at,
        nickname: comment.nickname || comment.user?.user_name,
        articleTitle: comment.article?.title, // 添加文章标题
        articleId: comment.article?.id,
        status: comment.isDeleted ? '已删除' : '正常'
      }));

      return {
        code: 200,
        data: {
          data: formatted,
          pagination: {
            current_page: page,
            per_limit: limit,
            total: total
          }
        }
      };
    } catch (error) {
      console.error('查询评论失败:', error);
      return { code: 500, message: '查询评论失败' };
    }
  }


  async findAll(articleId: number, page: number = 1, limit: number = 10) {
    try {
      const skip = (page - 1) * limit;
      const [comments, total] = await this.articleCommentRepository.findAndCount({
        where: {
          article: { id: articleId },
          parent: null
        },
        relations: ['replies', 'user'],
        order: { created_at: 'DESC' },
        skip,
        take: limit
      });

      // 格式化响应数据
      const formatted = comments.map(comment => ({
        id: comment.id,
        content: comment.content,
        created_at: comment.created_at.toISOString(),
        nickname: comment.nickname || comment.user?.user_name,
        avatar: comment.user?.image,
        replies: comment.replies.map(reply => ({
          id: reply.id,
          content: reply.content,
          created_at: reply.created_at.toISOString(),
          nickname: reply.nickname || reply.user?.user_name,
          avatar: reply.user?.image
        }))
      }));

      return {
        code: 200,
        data: {
          data: formatted,
          pagination: {
            current_page: page,
            per_limit: limit,
            total: total
          }
        }
      };
    } catch (error) {
      console.error('查询评论失败:', error);
      return { code: 500, message: '查询评论失败' };
    }
  }
  findOne(id: number) {
    return `This action returns a #${id} articleComment`;
  }

  update(id: number, updateArticleCommentDto: UpdateArticleCommentDto) {
    return `This action updates a #${id} articleComment`;
  }

  remove(id: number) {
    return `This action removes a #${id} articleComment`;
  }
}
