import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe, DefaultValuePipe, Put } from '@nestjs/common';
import { ThirdPartyLibraryService } from './third-party-library.service';
import { CreateThirdPartyLibraryDto } from './dto/create-third-party-library.dto';
import { UpdateThirdPartyLibraryDto } from './dto/update-third-party-library.dto';

@Controller('thirdPartyLibrary')
export class ThirdPartyLibraryController {
  constructor(private readonly thirdPartyLibraryService: ThirdPartyLibraryService) { }

  @Post()
  create(@Body() createThirdPartyLibraryDto: CreateThirdPartyLibraryDto) {
    return this.thirdPartyLibraryService.create(createThirdPartyLibraryDto);
  }

  @Get()
  findAll(@Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number, @Query('category') category?: string,      // 新增分类筛选
    @Query('tag') tag?: string,               // 新增标签筛选
    @Query('title') title?: string,          // 新增标题搜索
  ) {
    return this.thirdPartyLibraryService.findAll(page, limit, {
      category,
      tag,
      title
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.thirdPartyLibraryService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateThirdPartyLibraryDto: UpdateThirdPartyLibraryDto) {
    return this.thirdPartyLibraryService.update(+id, updateThirdPartyLibraryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.thirdPartyLibraryService.remove(+id);
  }
}
