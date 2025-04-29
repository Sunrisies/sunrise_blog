import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, Inject, HttpStatus, Query, DefaultValuePipe, ParseIntPipe } from '@nestjs/common';
import { CreateStorageDto } from './dto/create-storage.dto';
import { UpdateStorageDto } from './dto/update-storage.dto';
import { FileInterceptor } from "@nestjs/platform-express";
import { MulterOptions } from "@nestjs/platform-express/multer/interfaces/multer-options.interface";
import { CloudStorage } from './storage.interface';
import { StorageService } from './storage.service';
import { fileSizeInBytes } from 'src/utils';
@Controller('storage')
export class StorageController {
  constructor(@Inject('CLOUD_STORAGE') private readonly cloudStorage: CloudStorage,
    private readonly storageService: StorageService) { }
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async upload(@UploadedFile() file: Express.Multer.File) {
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
    console.log('Received file:', file); // Log the file object
    const data = await this.cloudStorage.upload(file, path);
    if (data.code !== 200) {
      return {
        code: HttpStatus.PRECONDITION_REQUIRED,
        message: "上传失败",
      };
    }
    const storage = await this.storageService.create({
      filename: fileName,
      path: data.url, // 假设云存储返回访问URL
      size: fileSizeInBytes(file.size),
      type: file.mimetype
    });
    return {
      code: HttpStatus.OK,
      message: "上传成功",
      data: storage, // 返回存储的文件信息
    }
  }

  @Get()
  async list(@Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number
  ) {
    return await this.storageService.findAll(page, limit)
  }

  @Delete(':id')
  async delete(@Param("id") id: string) {
    return this.storageService.delete(+id);
  }
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  create(@Body() createStorageDto: CreateStorageDto) {
    console.log('Received file:', createStorageDto); // Log the file object
    // return this.storageService.create(createStorageDto);
  }
}
