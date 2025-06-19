import { PaginatedResponseDto, ResponseDto } from '@/types'
import { Body, Controller, DefaultValuePipe, Delete, Get, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common'
import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger'
import { CreateThirdPartyLibraryDto } from './dto/create-third-party-library.dto'
import { UpdateThirdPartyLibraryDto } from './dto/update-third-party-library.dto'
import { ThirdPartyLibrary } from './entities/third-party-library.entity'
import { ThirdPartyLibraryService } from './third-party-library.service'

@ApiTags('第三方库')
@ApiBearerAuth()
@Controller('thirdPartyLibrary')
export class ThirdPartyLibraryController {
  constructor(private readonly thirdPartyLibraryService: ThirdPartyLibraryService) {}

  @ApiOperation({ summary: '添加第三方库' })
  @ApiOkResponse({
    description: '获取成功',
    type: ResponseDto<CreateThirdPartyLibraryDto>
  })
  @ApiBody({
    description: '第三方库信息',
    type: CreateThirdPartyLibraryDto
  })
  @Post()
  async create(@Body() createThirdPartyLibraryDto: CreateThirdPartyLibraryDto): Promise<ResponseDto<CreateThirdPartyLibraryDto>> {
    return this.thirdPartyLibraryService.create(createThirdPartyLibraryDto)
  }

  @ApiOperation({ summary: '获取第三方库列表' })
  @ApiOkResponse({
    description: '获取成功',
    type: PaginatedResponseDto<ThirdPartyLibrary>
  })
  @ApiQuery({
    name: 'page',
    required: false,
    default: 1,
    description: '页码，默认为1',
    example: 1,
    type: Number
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    default: 10,
    description: '每页数量，默认为10',
    example: 10,
    type: Number
  })
  @ApiQuery({
    name: 'categoryId',
    required: false,
    description: '分类ID',
    example: 1,
    type: Number
  })
  @ApiQuery({
    name: 'tag',
    required: false,
    description: '标签',
    example: '标签',
    type: String
  })
  @ApiQuery({
    name: 'name',
    required: false,
    description: '库名称',
    example: 'lodash',
    type: String
  })
  @Get()
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('categoryId') categoryId?: string, // 新增分类筛选
    @Query('tag') tag?: string, // 新增标签筛选
    @Query('name') name?: string // 新增标题搜索
  ): Promise<PaginatedResponseDto<ThirdPartyLibrary>> {
    return this.thirdPartyLibraryService.findAll(page, limit, {
      categoryId,
      tag,
      name
    })
  }

  @ApiOperation({ summary: '修改第三方库' })
  @ApiOkResponse({
    description: '修改成功',
    type: ResponseDto<UpdateThirdPartyLibraryDto>
  })
  @ApiBody({
    description: '第三方库信息',
    type: UpdateThirdPartyLibraryDto
  })
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateThirdPartyLibraryDto: UpdateThirdPartyLibraryDto
  ): Promise<ResponseDto<UpdateThirdPartyLibraryDto>> {
    return await this.thirdPartyLibraryService.update(+id, updateThirdPartyLibraryDto)
  }

  @ApiOperation({ summary: '删除第三方库' })
  @ApiOkResponse({ description: '删除成功', type: ResponseDto<boolean> })
  @ApiBody({
    description: '第三方库ID',
    type: Number
  })
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<ResponseDto<null>> {
    return await this.thirdPartyLibraryService.remove(+id)
  }
}
