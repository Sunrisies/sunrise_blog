import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto as AuthDto } from '../user/dto/create-user.dto';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }
  // 注册账号
  @Post("/register")
  async register(@Body() createAuthDto: AuthDto) {
    console.log(createAuthDto, "createAuthDto");
    return this.authService.register(createAuthDto);
  }

  // 登录账号
  @Post("/login")
  async login(@Body() createAuthDto: AuthDto) {
    return this.authService.login(createAuthDto);
  }
}
