import { PaginatedResponseDto, ResponseDto } from '@/types/index'
import { Body, Controller, DefaultValuePipe, Delete, Get, Param, ParseIntPipe, Put, Query } from '@nestjs/common'
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { UserService } from './user.service'
@ApiTags('用户管理')
@ApiBearerAuth()
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOperation({ summary: '获取用户列表' })
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
    name: 'user_name',
    required: false,
    description: '用户名搜索关键词',
    type: String
  })
  @ApiOkResponse({
    description: '分页用户列表',
    type: PaginatedResponseDto<CreateUserDto>
  })
  @ApiResponse({ status: 401, description: '未经授权' })
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('user_name') user_name?: string
  ): Promise<PaginatedResponseDto<CreateUserDto>> {
    console.log(page, limit, user_name)
    return this.userService.findAll(page, limit, user_name)
  }

  @Get(':id')
  @ApiOperation({
    summary: '获取用户详情',
    description: '根据用户ID获取用户详细信息'
  })
  @ApiParam({
    name: 'id',
    description: '用户ID',
    example: 1,
    type: Number
  })
  @ApiOkResponse({
    description: '用户详细信息',
    type: ResponseDto<CreateUserDto>
  })
  @ApiResponse({ status: 404, description: '用户不存在' })
  findOne(@Param('id') id: string): Promise<ResponseDto<CreateUserDto>> {
    return this.userService.findOne(+id)
  }

  @Put(':id')
  @ApiOperation({
    summary: '更新用户信息',
    description: '根据用户ID更新用户资料'
  })
  @ApiParam({
    name: 'id',
    description: '用户ID',
    example: 1,
    type: Number
  })
  @ApiOkResponse({
    description: '更新后的用户信息',
    type: ResponseDto<CreateUserDto>
  })
  @ApiResponse({ status: 400, description: '请求参数错误' })
  @ApiResponse({ status: 404, description: '用户不存在' })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto): Promise<ResponseDto<CreateUserDto>> {
    return this.userService.update(+id, updateUserDto)
  }

  @Delete(':id')
  @ApiOperation({
    summary: '删除用户',
    description: '根据用户ID永久删除用户账号'
  })
  @ApiParam({
    name: 'id',
    description: '用户ID',
    example: 1,
    type: Number,
    schema: {
      default: 1
    }
  })
  @ApiOkResponse({
    description: '已删除的用户信息',
    type: ResponseDto<null>
  })
  @ApiResponse({ status: 404, description: '用户不存在' })
  remove(@Param('id') id: string): Promise<ResponseDto<null>> {
    return this.userService.remove(+id)
  }
}
