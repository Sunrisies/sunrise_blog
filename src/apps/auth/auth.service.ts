import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto as AuthDto } from '../user/dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import * as bcrypt from 'bcryptjs';
import { CustomUnauthorizedException } from 'src/utils/custom-exceptions';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) { }
  async register(createAuthDto: AuthDto) {
    console.log(createAuthDto);
    // 先确定是否有该用户
    const findUser = await this.userRepository.findOne({ where: { user_name: createAuthDto.user_name } });
    if (findUser) {
      return {
        code: 400,
        message: "账号已存在",
        data: null,
      };
    }
    const saltRounds = 10; // 加密强度，数值越大，加密越慢，安全性越高
    const hashedPassword = await bcrypt.hash(createAuthDto.pass_word, saltRounds);
    // 这里假设注册成功
    try {
      const newUser = await this.userRepository.create({
        ...createAuthDto, pass_word: hashedPassword
      });
      const savedUser = await this.userRepository.save(newUser);
      return {
        code: 200,
        message: "注册成功",
        data: {
          id: savedUser.id,
          user_name: savedUser.user_name
        }
      };
    } catch (error) {
      throw new CustomUnauthorizedException("注册失败", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  async login(createAuthDto: AuthDto) {

  }
}
