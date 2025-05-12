import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ToolsService } from './tools.service';
import { CreateToolDto } from './dto/create-tool.dto';
import { UpdateToolDto } from './dto/update-tool.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags("工具")
@Controller('tools')
export class ToolsController {
  constructor(private readonly toolsService: ToolsService) { }

  // 获取邮箱验证码 获取邮箱号
  @Post("email/code")
  @ApiOperation({ summary: "获取邮箱验证码" })
  @ApiResponse({ status: 200, description: "邮箱验证码" })
  async getEmailCode(@Body() { email }: { email: string }): Promise<{ data: string }> {
    const data = await this.toolsService.sendEmailCode(email);
    return { data };
  }


  @Get()
  findAll() {
    return this.toolsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.toolsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateToolDto: UpdateToolDto) {
    return this.toolsService.update(+id, updateToolDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.toolsService.remove(+id);
  }
}
