import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './entities/message.entity';
import { User } from '../user/entities/user.entity';
import { CreateMessageDto, IMessage } from './dto/create-message.dto';
import { PaginatedResponseDto, ResponseDto } from '@/types';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) { }

  async create(createMessageDto: CreateMessageDto): Promise<ResponseDto<CreateMessageDto>> {
    try {
      let user: User = null;
      if (createMessageDto.userId) {
        user = await this.userRepository.findOne({
          where: { id: createMessageDto.userId }
        });
        if (!user) {
          return { code: 404, message: '用户不存在', data: null };
        }
      }

      let parentMessage: Message = null;
      if (createMessageDto.parentId) {
        parentMessage = await this.messageRepository.findOne({
          where: { id: createMessageDto.parentId }
        });
        if (!parentMessage) {
          return { code: 404, message: '父级留言不存在', data: null };
        }
      }

      const newMessage = this.messageRepository.create({
        content: createMessageDto.content,
        user,
        parent: parentMessage,
        nickname: createMessageDto.nickname,
        email: createMessageDto.email
      });

      const savedMessage = await this.messageRepository.save(newMessage);
      return {
        code: 200,
        message: '留言创建成功',
        data: newMessage
      };
    } catch (error) {
      console.error('创建留言失败:', error);
      return { code: 500, message: '留言创建失败', data: null };
    }
  }

  async findAll(page: number, limit: number): Promise<PaginatedResponseDto<IMessage>> {
    try {
      const skip = (page - 1) * limit;

      // 修改查询条件，只获取顶层留言及其回复
      const [messages, total] = await this.messageRepository
        .createQueryBuilder('message')
        .leftJoinAndSelect('message.replies', 'replies')
        .leftJoinAndSelect('message.user', 'user')
        .leftJoinAndSelect('replies.user', 'replyUser')
        .where('message.parent IS NULL')  // 只查询顶层留言
        .andWhere('message.isDeleted = :isDeleted', { isDeleted: false })
        .orderBy('message.created_at', 'DESC')
        .skip(skip)
        .take(limit)
        .getManyAndCount();

      // 格式化返回数据
      const formatted = messages.map(message => ({
        id: message.id,
        content: message.content,
        created_at: message.created_at.toISOString(),
        nickname: message.nickname || message.user?.user_name,
        avatar: message.user?.image,
        email: message.email,
        replies: message.replies
          .filter(reply => !reply.isDeleted)  // 过滤已删除的回复
          .sort((a, b) => b.created_at.getTime() - a.created_at.getTime())  // 回复按时间降序
          .map(reply => ({
            id: reply.id,
            content: reply.content,
            created_at: reply.created_at.toISOString(),
            nickname: reply.nickname || reply.user?.user_name,
            avatar: reply.user?.image,
            email: reply.email,
          }))
      }));

      return {
        code: 200,
        data: {
          data: formatted,
          pagination: {
            page,
            limit,
            total
          }
        },
        message: '查询留言成功'
      };
    } catch (error) {
      console.error('查询留言失败:', error);
      return { code: 500, message: '查询留言失败', data: null };
    }
  }
}