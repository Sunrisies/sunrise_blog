import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import Joi from 'joi'
import * as nodemail from 'nodemailer'

@Injectable()
export class Email {
  private transporter = null
  constructor(private configService: ConfigService) {
    const validationSchema = Joi.object({
      email: Joi.object({
        // 新增邮件配置验证
        host: Joi.string().required(),
        port: Joi.number().required(),
        secure: Joi.boolean().required(),
        user: Joi.string().email().required(),
        pass: Joi.string().required(),
        alias: Joi.string().required()
      })
    })
    const config = {
      email: this.configService.get('email') // 从 ConfigService 获取 email configuration
    }
    const { error, value } = validationSchema.validate(config)
    console.error('Email config validation error:', error)
    this.transporter = nodemail.createTransport({
      host: value.email.host,
      port: value.email.port,
      secure: value.email.secure,
      auth: {
        user: value.email.user,
        pass: value.email.pass
      }
    })
  }
  // 发送验证码的方法
  async send(params: { email: string; code: string; subject?: string; html?: string; time?: string }) {
    const { email, code, subject = 'WEBXUE', html, time = '5' } = params

    // 提前获取配置项避免重复调用
    const [alias, user] = [this.configService.get('email.alias'), this.configService.get('email.user')]

    try {
      const info = await this.transporter.sendMail({
        from: `${alias}<${user}>`,
        to: email,
        subject,
        text: `验证码为${code} 有效期为${time} 分钟`,
        html: html || `<p>您的验证码是：<strong>${code}</strong>，有效期${time}分钟</p>`
      })
      console.log(info)
      return true
    } catch (error) {
      console.error('邮件发送失败', {
        error: error.message,
        recipient: email,
        timestamp: new Date().toISOString()
      })
      throw new Error(`邮件发送失败: ${error.message}`)
    }
  }
}
