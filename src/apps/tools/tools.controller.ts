import { Body, Controller, Post } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { ToolsService } from './tools.service'

@ApiTags('工具')
@Controller('tools')
export class ToolsController {
  constructor(private readonly toolsService: ToolsService) {}

  // 获取邮箱验证码 获取邮箱号
  @Post('email/code')
  @ApiOperation({ summary: '获取邮箱验证码' })
  @ApiResponse({ status: 200, description: '邮箱验证码' })
  async getEmailCode(@Body() { email }: { email: string }): Promise<{ data: string }> {
    const data = await this.toolsService.sendEmailCode(email)
    return { data }
  }
}
