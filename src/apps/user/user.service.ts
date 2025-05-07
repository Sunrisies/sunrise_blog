import { PaginatedResponseDto, ResponseDto } from '@/types';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) { }

  async findAll(page: number, limit: number, user_name?: string): Promise<PaginatedResponseDto<User>> {
    const queryBuilder = this.userRepository.createQueryBuilder('user');

    if (user_name) {
      queryBuilder.where('user.user_name LIKE :user_name', { user_name: `%${user_name}%` });
    }

    const [users, total] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    const totalPage = Math.ceil(total / limit);

    if (page > totalPage && totalPage > 0) {
      return {
        code: 400,
        message: `请求页码超出范围，最大页数为 ${totalPage}`,
        data: null
      };
    }

    return {
      code: 200,
      data: {
        data: users,
        pagination: {
          page: page,
          limit: limit,
          total: total
        }
      },
      message: '查询成功'
    };
  }

  async findOne(id: number): Promise<ResponseDto<User>> {
    // 查询用户信息
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      return { code: 404, message: '没有找到该用户', data: null };
    }
    return { data: user, message: '查询成功', code: 200 };
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<ResponseDto<User>> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      return { code: 404, message: '没有找到该用户', data: null };
    }
    // 如果是密码怎么修改,需要加密
    if (updateUserDto.pass_word) {
      const saltRounds = 10; // 加密强度，数值越大，加密越慢，安全性越高
      user.pass_word = await bcrypt.hash(updateUserDto.pass_word, saltRounds);
    }
    if (updateUserDto.user_name) {
      user.user_name = updateUserDto.user_name; // 假设用户名可以直接更新
    }
    if (updateUserDto.image) {
      user.image = updateUserDto.image; // 假设头像可以直接更新 
    }
    if (updateUserDto.phone) {
      user.phone = updateUserDto.phone; // 假设手机号可以直接更新 
    }
    if (updateUserDto.email) {
      user.email = updateUserDto.email; // 假设邮箱可以直接更新 
    }
    try {
      await this.userRepository.save(user);
      return { code: 200, message: '用户信息更新成功', data: user };
    } catch (error) {
      return { code: 500, message: '用户信息更新失败', data: null };
    }
  }

  async remove(id: number): Promise<ResponseDto<null>> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      return { code: 404, message: '没有找到该用户', data: null };
    }
    try {
      await this.userRepository.remove(user);
      return { code: 200, message: '用户删除成功', data: null };
    } catch (error) {
      return { code: 500, message: '用户删除失败', data: null };
    }
  }
}
