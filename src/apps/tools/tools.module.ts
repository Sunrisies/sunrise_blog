import { Email } from '@/utils/email-tools'; // 导入自定义工具类，用于发送邮件验证码
import { Module } from '@nestjs/common';
import { ToolsController } from './tools.controller';
import { ToolsService } from './tools.service';
// 导入 EmailModule 模块，用于发送邮件验证码
@Module({
  controllers: [ToolsController],
  providers: [ToolsService, Email],
})
export class ToolsModule { }
