import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, Inject, HttpStatus, Query, DefaultValuePipe, ParseIntPipe } from '@nestjs/common';
import { CreateStorageDto } from './dto/create-storage.dto';
import { FileInterceptor } from "@nestjs/platform-express";
import { CloudStorage } from './storage.interface';
import { StorageService } from './storage.service';
import { fileSizeInBytes } from 'src/utils';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOkResponse, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { PaginatedResponseDto, ResponseDto } from '@/types';
import { Storage } from './entities/storage.entity';
@ApiTags('文件管理')
@ApiBearerAuth()
@Controller('storage')
export class StorageController {
  constructor(@Inject('CLOUD_STORAGE') private readonly cloudStorage: CloudStorage,
    private readonly storageService: StorageService) { }
  @ApiOperation({ summary: '添加文件' })
  @ApiOkResponse({ description: '添加成功', type: ResponseDto<Storage> })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: '文件信息',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary'
        }
      },
      required: ['file']
    }
  })
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async upload(@UploadedFile() file: Express.Multer.File): Promise<ResponseDto<Storage>> {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const reg = /[^\w\-\.]/;
    const type = file.mimetype;
    const size = fileSizeInBytes(file.size);
    // if (reg.test(file.originalname)) {
    //   return {
    //     code: HttpStatus.PRECONDITION_REQUIRED,
    //     message: "文件名包含非英文字符",
    //   };
    // }
    let fileName = file.originalname;
    const path = `uploads/${year}/${month}/${day}/${fileName}`;
    const data = await this.cloudStorage.upload(file, path);
    console.log(data); // 假设云存储返回访问URL
    if (data.code !== 200) {
      return {
        code: HttpStatus.PRECONDITION_REQUIRED,
        message: "上传失败",
        data: null,
      };
    }
    const storage = await this.storageService.create({
      filename: fileName,
      path: data.url, // 假设云存储返回访问URL
      size: fileSizeInBytes(file.size),
      type: file.mimetype,
      storage_provider: data.storage_provider,
    });
    return {
      code: HttpStatus.OK,
      message: "上传成功",
      data: storage, // 返回存储的文件信息
    }
  }

  @ApiOperation({ summary: '获取文件列表' })
  @ApiOkResponse({ description: '获取成功', type: ResponseDto<Storage> })
  @ApiQuery({ name: 'type', required: false, description: '文件类型' })
    @ApiQuery({ name: 'page', required: false, description: '页码' })
  @ApiQuery({ name: 'limit', required: false, description: '每页数量' })
    @ApiQuery({ name: 'search', required: false, description: '搜索文件名称' })
  @Get()
  async list(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('type') type?: string,
    @Query('search') search?: string,
  ): Promise<PaginatedResponseDto<Storage>> {
    return await this.storageService.findAll(page, limit, type, search)
  }

  @ApiOperation({ summary: '删除文件' })
  @ApiOkResponse({ description: '删除成功', type: ResponseDto<null> })
  @ApiBody({
    description: '文件信息',
    type: ResponseDto<null>,
  })
  @Delete(':id')
  async delete(@Param("id") id: string): Promise<ResponseDto<null>> {
    return this.storageService.delete(+id);
  }
}
