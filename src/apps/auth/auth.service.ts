import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto as AuthDto } from '../user/dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RolePermissions, User, UserRole } from '../user/entities/user.entity';
import * as bcrypt from 'bcryptjs';
import { CustomUnauthorizedException } from 'src/utils/custom-exceptions';
import { JwtService } from '@nestjs/jwt';
import Redis from "ioredis";
import { InjectRedis } from '@nestjs-modules/ioredis';
import { ILogin, ResponseDto } from '@/types';
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    @InjectRedis() private readonly redis: Redis,
  ) { }
  async register(createAuthDto: AuthDto) {
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
        ...createAuthDto, pass_word: hashedPassword,
        role: UserRole.USER, // 设置默认角色
        permissions: RolePermissions[UserRole.USER] // 设置默认权限
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
      console.error("注册失败:", error);
      throw new CustomUnauthorizedException("注册失败", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async login(createAuthDto: AuthDto): Promise<ResponseDto<ILogin>> {
    const user = await this.userRepository.findOne({
      where: { user_name: createAuthDto.user_name },
      select: ['id', 'user_name', 'pass_word', 'email', 'phone', 'role', 'permissions'] // 添加 role 和 permissions
    });
    
    // 用户不存在校验
    if (!user) {
      throw new CustomUnauthorizedException('用户不存在', HttpStatus.NOT_FOUND);
    }
    // 密码校验
    const isPasswordValid = await bcrypt.compare(
      createAuthDto.pass_word,
      user.pass_word
    );
    if (!isPasswordValid) {
      throw new CustomUnauthorizedException('密码错误', HttpStatus.UNPROCESSABLE_ENTITY);
    }

    // 生成JWT令牌（需要先安装@nestjs/jwt）
    // 生成JWT令牌，添加角色和权限信息
    const payload = {
      sub: user.id,
      username: user.user_name,
      role: user.role,
      permissions: user.permissions
    };
    const accessToken = await this.jwtService.sign(payload);

    await this.redis.set(
      `access_token:${accessToken}`,
      JSON.stringify(payload),
      'EX',
      3600
    );
    
    // 返回用户信息（排除密码）
    const { pass_word, ...userInfo } = user;
    return {
      code: 200,
      message: "登录成功",
      data: {
        user: userInfo,
        access_token: accessToken,
        expires_in: 3600
      }
    };
  }
}
