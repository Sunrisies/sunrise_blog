import { Email } from '@/utils/email-tools'
import { Injectable } from '@nestjs/common'

@Injectable()
export class ToolsService {
  constructor(private emailUtils: Email) {}
  // @Inject("REDIS_CLIENT")
  // private redisClient: RedisClientType;
  // 获取邮箱验证码
  async sendEmailCode(email: string): Promise<string> {
    const code = Math.random().toString().slice(-6)
    // const result = await this.redis.set(email, code, "EX", 60 * 5);
    const data = await this.emailUtils.send({
      email,
      subject: 'chaoYang - 欢迎注册',
      code,
      html: `您的验证码为：${code}`,
      time: '5'
    })
    console.log(data, '==============')
    return '验证码发送成功'
  }
}
