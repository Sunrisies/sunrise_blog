import { Controller, Get, Post, Body, Patch, Param, Delete, Put, HttpCode, Query, ParseEnumPipe, BadRequestException, UseGuards } from '@nestjs/common';
import { TagsService } from './tags.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { JwtGuard } from 'src/guard/jwt.guard';
@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) { }

  @Post()
  // @HttpCode(200)
  create(@Body() createTagDto: CreateTagDto) {
    return this.tagsService.create(createTagDto);
  }

  @UseGuards(JwtGuard)
  @Get()
  findAll(@Query('type', new ParseEnumPipe(['article', 'library'], {
    optional: true,// 添加可选配置
    exceptionFactory: () => new BadRequestException('type参数必须是 article 或 library')
  })) type?: 'article' | 'library') {
    return this.tagsService.findAll(type);
  }


  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.tagsService.findOne(+id);
  }

  @Put(":id")
  update(@Param("id") id: string, @Body() updateTagDto: UpdateTagDto) {
    return this.tagsService.update(+id, updateTagDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.tagsService.remove(+id);
  }
}
