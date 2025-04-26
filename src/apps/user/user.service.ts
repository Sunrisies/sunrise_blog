import { Injectable, Param } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) { }

  async findAll(page: number, limit: number) {
    const total = await this.userRepository.count();
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
    const users = await this.userRepository.find({
      skip: startIndex,
      take: limit,
    });

    return {
      code: 200,
      data: {
        data: users,
        pagination: {
          page: page,
          limit: limit,
          total: total
        }
      }
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
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

  async remove(id: number) {
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
