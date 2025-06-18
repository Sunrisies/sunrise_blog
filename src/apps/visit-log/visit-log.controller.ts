import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common';
import { VisitLogService } from './visit-log.service';
import { ApiTags, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { CreateVisitLogDto } from './dto/create-visit-log.dto';

@ApiTags('访问日志')
@Controller('visitLog')
export class VisitLogController {
  constructor(private readonly visitLogService: VisitLogService) {}

  @Post()
  @ApiOperation({ summary: '创建访问日志' })
  create(@Body() visitLog: CreateVisitLogDto) {
    console.log(visitLog, '-1-1--1-1-1-1-1--1');
    return this.visitLogService.create(visitLog);
  }

  @Get()
  @ApiOperation({ summary: '获取访问日志列表' })
  @ApiQuery({
    name: 'page',
    required: false,
    description: '页码，默认为1',
    type: Number,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: '每页数量，默认为10',
    type: Number,
  })
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return this.visitLogService.findAll(page, limit);
  }
}
