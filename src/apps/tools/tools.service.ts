import { Injectable } from '@nestjs/common';
import { CreateToolDto } from './dto/create-tool.dto';
import { UpdateToolDto } from './dto/update-tool.dto';
import { Email } from 'src/utils/email-tools';

@Injectable()
export class ToolsService {
  constructor(private emailUtils: Email) { }
  // @Inject("REDIS_CLIENT")
  // private redisClient: RedisClientType;
  // 获取邮箱验证码
  async sendEmailCode(email: string): Promise<string> {

    const code = Math.random().toString().slice(-6);
    // const result = await this.redis.set(email, code, "EX", 60 * 5);
    const data1 = await this.emailUtils.send({
      email,
      subject: "chaoYang - 欢迎注册",
      code,
      html: `您的验证码为：${code}`,
      time: "5",
    });
    // console.log(result, data1, "==============");
    return "验证码发送成功";
  }


  findAll() {
    return `This action returns all tools`;
  }

  findOne(id: number) {
    return `This action returns a #${id} tool`;
  }

  update(id: number, updateToolDto: UpdateToolDto) {
    return `This action updates a #${id} tool`;
  }

  remove(id: number) {
    return `This action removes a #${id} tool`;
  }
}
