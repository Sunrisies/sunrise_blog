import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common';
import { MessageService } from './message.service';
import { CreateMessageDto, IMessage } from './dto/create-message.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { PaginatedResponseDto, ResponseDto } from '@/types';
import { Message } from './entities/message.entity';
@ApiTags('留言板管理')
@ApiBearerAuth()
@Controller('messages')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @ApiOperation({ summary: '添加留言' })
  @ApiOkResponse({
    description: '添加成功',
    type: ResponseDto<CreateMessageDto>,
  })
  @ApiBody({
    description: '留言信息',
    type: CreateMessageDto,
  })
  @Post()
  async create(
    @Body() createMessageDto: CreateMessageDto,
  ): Promise<ResponseDto<CreateMessageDto>> {
    return await this.messageService.create(createMessageDto);
  }

  @ApiOperation({ summary: '获取留言列表' })
  @ApiOkResponse({
    description: '获取成功',
    type: PaginatedResponseDto<IMessage>,
  })
  @ApiQuery({
    name: 'page',
    description: '页码',
    default: 1, // 默认值为1
    required: false,
    type: Number,
  })
  @ApiQuery({
    name: 'limit',
    description: '每页数量',
    default: 10, // 默认值为10
    required: false,
    type: Number,
  })
  @Get()
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ): Promise<PaginatedResponseDto<IMessage>> {
    return this.messageService.findAll(page, limit);
  }
}
