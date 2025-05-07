import { Body, Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserDto as AuthDto } from '@/apps/user/dto/create-user.dto';
import { AuthService } from './auth.service';
import { ILogin, ResponseDto } from '@/types';

@ApiTags('权限管理')
@ApiBearerAuth()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }
  // 注册账号
  @Post("/register")
  @ApiOperation({ summary: '注册账号' })
  @ApiOkResponse({ description: '注册成功', type: ResponseDto<AuthDto> })
  @ApiBody({
    description: '用户信息',
    type: AuthDto,
  })
  async register(@Body() createAuthDto: AuthDto) {
    return this.authService.register(createAuthDto);
  }

  // 登录账号
  @Post("/login")
  @ApiOperation({ summary: '登录账号' })
  @ApiOkResponse({ description: '登录成功', type: ResponseDto<ILogin> })
  @ApiResponse({ status: 422, description: '密码错误', type: ResponseDto<null> })
  @ApiBody({
    description: '用户信息',
    type: AuthDto,
  })
  async login(@Body() createAuthDto: AuthDto): Promise<ResponseDto<ILogin>> {
    return this.authService.login(createAuthDto);
  }
}
