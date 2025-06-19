import { RolePermissions, User, UserRole } from '@/apps/user/entities/user.entity'
import { ILogin, LoginType, ResponseDto } from '@/types'
import { CustomUnauthorizedException } from '@/utils/custom-exceptions'
import { InjectRedis } from '@nestjs-modules/ioredis'
import { HttpStatus, Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { InjectRepository } from '@nestjs/typeorm'
import * as bcrypt from 'bcryptjs'
import Redis from 'ioredis'
import { authenticator } from 'otplib'
import QRCode from 'qrcode'
import { DataSource, Repository } from 'typeorm'
import { CreateUserDto as AuthDto } from '../user/dto/create-user.dto'
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    @InjectRedis() private readonly redis: Redis,
    private dataSource: DataSource
  ) {}
  async register(createAuthDto: AuthDto) {
    const queryRunner = this.dataSource.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()
    try {
      const findUser = await queryRunner.manager.findOne(User, {
        where: { user_name: createAuthDto.user_name }
      })
      if (findUser) {
        await queryRunner.rollbackTransaction()
        return {
          code: 400,
          message: '账号已存在',
          data: null
        }
      }
      const saltRounds = 10 // 加密强度，数值越大，加密越慢，安全性越高
      const hashedPassword = await bcrypt.hash(createAuthDto.pass_word, saltRounds)
      const newUser = queryRunner.manager.create(User, {
        ...createAuthDto,
        pass_word: hashedPassword,
        role: UserRole.USER
        // permissions: RolePermissions[UserRole.USER]
      })
      const savedUser = await queryRunner.manager.save(newUser)
      console.log(newUser, '=======')
      await queryRunner.commitTransaction()
      return {
        code: 200,
        message: '注册成功',
        data: {
          id: savedUser.id,
          user_name: savedUser.user_name
        }
      }
    } catch (error) {
      await queryRunner.rollbackTransaction()
      console.error('注册失败:', error)
      throw new CustomUnauthorizedException('注册失败', HttpStatus.INTERNAL_SERVER_ERROR)
    } finally {
      console.log('释放资源')
      await queryRunner.release()
    }
  }
  private async buildLoginCondition(loginDto: LoginType) {
    switch (loginDto.method) {
      case 'password':
        return { user_name: loginDto.user_name }
      case 'phone-password':
        return { phone: loginDto.phone }
      case 'email-password':
        return { email: loginDto.email }
      default:
        throw new CustomUnauthorizedException('不支持的登录方式', HttpStatus.BAD_REQUEST)
    }
  }

  private async buildLogin(loginDto: LoginType) {
    switch (loginDto.method) {
      case 'password':
        return { ...loginDto }
      case 'phone-password':
        return { ...loginDto }
      case 'email-password':
        return { ...loginDto }
      default:
        throw new CustomUnauthorizedException('不支持的登录方式', HttpStatus.BAD_REQUEST)
    }
  }

  private async findUserByCondition(condition: object) {
    return this.userRepository.findOne({
      where: condition,
      select: ['id', 'user_name', 'pass_word', 'email', 'phone', 'role', 'permissions']
    })
  }

  private async validateCredentials(user: User, password: string) {
    const isValid = await bcrypt.compare(password, user.pass_word)
    if (!isValid) {
      throw new CustomUnauthorizedException('密码错误', HttpStatus.UNAUTHORIZED)
    }
  }

  private async generateAuthToken(user: User) {
    const payload = {
      sub: user.id,
      username: user.user_name,
      role: user.role,
      permissions: user.permissions
    }
    const accessToken = this.jwtService.sign(payload)

    await this.redis.set(`access_token:${accessToken}`, JSON.stringify(payload), 'EX', 3600)

    return accessToken
  }

  async login(loginDto: LoginType): Promise<ResponseDto<ILogin>> {
    const condition = await this.buildLoginCondition(loginDto)
    const user = await this.findUserByCondition(condition)
    const login = await this.buildLogin(loginDto)
    if (!user) {
      const errorMessages = {
        password: '用户不存在',
        'phone-password': '手机号未绑定',
        'email-password': '邮箱未注册'
      }
      const message = errorMessages[loginDto.method] || '用户不存在'
      throw new CustomUnauthorizedException(message, HttpStatus.NOT_FOUND)
    }

    await this.validateCredentials(user, login.pass_word)
    const accessToken = await this.generateAuthToken(user)

    const { pass_word, ...userInfo } = user
    console.info('用户密码:', pass_word)
    return {
      code: 200,
      message: '登录成功',
      data: {
        user: userInfo,
        access_token: accessToken,
        expires_in: 3600
      }
    }
  }

  /**
   * 更新所有用户的权限
   */
  async updateAllUsersPermissions(): Promise<void> {
    // 更新管理员权限
    await this.userRepository.update({ role: UserRole.ADMIN }, { permissions: RolePermissions[UserRole.ADMIN] })

    // 更新编辑者权限
    await this.userRepository.update({ role: UserRole.EDITOR }, { permissions: RolePermissions[UserRole.EDITOR] })

    // 更新普通用户权限
    await this.userRepository.update({ role: UserRole.USER }, { permissions: RolePermissions[UserRole.USER] })

    // 更新访客权限
    await this.userRepository.update({ role: UserRole.GUEST }, { permissions: RolePermissions[UserRole.GUEST] })
  }

  /**
   * 更新单个用户的权限
   */
  async updateUserPermissions(userId: number): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id: userId } })
    if (user) {
      user.permissions = RolePermissions[user.role]
      await this.userRepository.save(user)
    }
  }
  //绑定端点：生成 OTP 密钥和二维码
  async generateOtpSecret(user_name: string, app_name: string): Promise<{ secret: string; qrCodeUrl: string }> {
    // 生成 OTP 密钥
    const secret = authenticator.generateSecret()

    // 生成二维码 URL
    const otpUrl = authenticator.keyuri(user_name, app_name, secret)
    const qrCodeUrl = await QRCode.toDataURL(otpUrl)
    return { secret, qrCodeUrl }
  }

  //验证端点：验证 OTP 码
  async verifyOtpCode(user_name: string, otpCode: string): Promise<boolean> {
    // 从数据库中获取用户的 OTP 密钥
    const user = await this.userRepository.findOne({ where: { user_name } })
    if (!user || !user.otp_secret) {
      return false // 用户不存在或未设置 OTP 密钥
    }

    // 验证 OTP 码
    const isValid = authenticator.verify({
      token: otpCode,
      secret: user.otp_secret
    })
    console.log('验证 OTP 码:', isValid)
  }
}
