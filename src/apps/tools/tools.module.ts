import { Module } from '@nestjs/common';
import { ToolsService } from './tools.service';
import { ToolsController } from './tools.controller';
import { Email } from 'src/utils/email-tools'; // 导入自定义工具类，用于发送邮件验证码
// 导入 EmailModule 模块，用于发送邮件验证码
@Module({
  controllers: [ToolsController],
  providers: [ToolsService, Email],
})
export class ToolsModule { }
