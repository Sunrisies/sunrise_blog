import { CreateUserDto as AuthDto } from '@/apps/user/dto/create-user.dto';

import { ApiProperty } from '@nestjs/swagger';

// 分页元数据DTO
class PaginatedMetaDto {
    @ApiProperty({ description: '当前页码', example: 1 })
    page: number;

    @ApiProperty({ description: '每页数量', example: 10 })
    limit: number;

    @ApiProperty({ description: '总数据量', example: 100 })
    total: number;
}

// 通用分页响应DTO
// 先定义分页数据类
class PaginatedDataDto<T> {
    @ApiProperty({ type: [Object], description: '分页数据' })
    data: T[];

    @ApiProperty({ type: PaginatedMetaDto })
    pagination: PaginatedMetaDto;
}

// 后定义分页响应类
export class PaginatedResponseDto<T> {
    @ApiProperty({ description: '状态码', example: 200 })
    code: number;

    @ApiProperty({
        description: '响应数据',
        type: () => PaginatedDataDto<T>
    })
    data: PaginatedDataDto<T>;

    @ApiProperty({ description: '提示信息', example: '操作成功' })
    message?: string;
}

// 基础响应DTO（非分页）
export class ResponseDto<T> {
    @ApiProperty({ description: '状态码', example: 200 })
    code?: number;

    @ApiProperty({ description: '响应数据' })
    data: T | null;

    @ApiProperty({ description: '提示信息', example: '操作成功' })
    message: string;
}
export interface ILogin {
    user: Omit<AuthDto, 'pass_word'>;
    access_token: string;
    expires_in: number;
}


// 登录凭证基础接口
interface LoginBase {
    method: 'password' | 'phone' | 'email' | 'email-password' | 'phone-password';
}

// 密码登录类型
interface PasswordLogin extends LoginBase {
    method: 'password';
    user_name: string;
    pass_word: string;
}

// 手机验证码登录
interface PhoneLogin extends LoginBase {
    method: 'phone';
    phone: string;
    code: string;
}

// 邮箱验证码登录 
interface EmailLogin extends LoginBase {
    method: 'email';
    email: string;
    code: string;
}
// 新增两种复合登录方式
interface EmailPasswordLogin extends LoginBase {
    method: 'email-password';
    email: string;
    pass_word: string;
}

interface PhonePasswordLogin extends LoginBase {
    method: 'phone-password';
    phone: string;
    pass_word: string;
}

export type LoginType = PasswordLogin | PhoneLogin | EmailLogin | EmailPasswordLogin | PhonePasswordLogin;

// 定义同步结果的接口
export interface SyncResult {
    repository: string;
    status: 'success' | 'failed';
    error?: string;
}

export interface SitemapItem {
    url: string;
    lastModified: Date;
    changeFrequency: string;
    priority: number;
  }