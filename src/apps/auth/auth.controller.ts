import { CreateUserDto as AuthDto } from '@/apps/user/dto/create-user.dto';
import { ILogin, ResponseDto } from '@/types';
import { Body, Controller, HttpStatus, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginType } from '@/types/index'
import { CustomUnauthorizedException } from '@/utils/custom-exceptions';

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
    description: '登录凭证',
    schema: {
      oneOf: [
        {
          properties: {
            method: { type: 'string', example: 'password', default: 'password' },
            user_name: { type: 'string', example: 'john_doe' },
            pass_word: { type: 'string', example: 'your_password' }
          },
          required: ['method', 'user_name', 'pass_word']
        },
        {
          properties: {
            method: { type: 'string', example: 'phone-password' },
            phone: { type: 'string', example: '13800138000' },
            pass_word: { type: 'string', example: 'your_password' }
          },
          required: ['method', 'phone', 'pass_word']
        },
        {
          properties: {
            method: { type: 'string', example: 'email-password' },
            email: { type: 'string', example: 'user@example.com' },
            pass_word: { type: 'string', example: 'your_password' }
          },
          required: ['method', 'email', 'pass_word']
        }
      ]
    }
  })
  async login(@Body() loginDto: LoginType): Promise<ResponseDto<ILogin>> {
    // 参数校验规则
    const validateParams = (method: string, allowedKeys: string[]) => {
      const extraKeys = Object.keys(loginDto).filter(
        key => ![...allowedKeys, 'method'].includes(key)
      );
      if (extraKeys.length > 0) {
        throw new CustomUnauthorizedException(
          `无效参数: ${extraKeys.join('、')}，请使用 ${allowedKeys.join(' 或 ')}`,
          HttpStatus.BAD_REQUEST
        );
      }
    };

    switch (loginDto.method) {
      case 'password':
        validateParams('password', ['user_name', 'pass_word']);
        break;
      case 'phone-password':
        validateParams('phone-password', ['phone', 'pass_word']);
        break;
      case 'email-password':
        validateParams('email-password', ['email', 'pass_word']);
        break;
      default:
        throw new CustomUnauthorizedException(
          '不支持的登录方式',
          HttpStatus.BAD_REQUEST
        );
    }

    // 如果是账号跟密码登录
    if (loginDto.method === 'password' || loginDto.method === 'email-password' || loginDto.method === 'phone-password') {
      return this.authService.login(loginDto);
    }
  }

  @Post('update-permissions')
  @ApiOperation({ summary: '更新所有用户的权限' })
  @ApiOkResponse({ description: '权限更新成功' })
  @ApiResponse({ status: 403, description: '没有权限' })
  // @RequirePermissions(Permission.Admin)
  async updateAllPermissions(): Promise<ResponseDto<null>> {
    await this.authService.updateAllUsersPermissions();
    return {
      code: 200,
      message: '权限更新成功',
      data: null
    };
  }

  @ApiOperation({ summary: '更新用户权限' })
  @ApiOkResponse({ description: '用户权限更新成功' })
  @ApiResponse({ status: 403, description: '没有权限' })
  @Post('update-permission/:id')
  async updateUserPermission(@Param('id') id: string): Promise<ResponseDto<null>> {
    await this.authService.updateUserPermissions(+id);
    return {
      code: 200,
      message: '用户权限更新成功',
      data: null
    };
  }
}
