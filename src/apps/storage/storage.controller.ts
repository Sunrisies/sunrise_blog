import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, Inject } from '@nestjs/common';
import { CreateStorageDto } from './dto/create-storage.dto';
import { UpdateStorageDto } from './dto/update-storage.dto';
import { FileInterceptor } from "@nestjs/platform-express";
import { MulterOptions } from "@nestjs/platform-express/multer/interfaces/multer-options.interface";
import { CloudStorage } from './storage.interface';
@Controller('storage')
export class StorageController {
  constructor(@Inject('CLOUD_STORAGE') private readonly storageService: CloudStorage) { }
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async upload(@UploadedFile() file: Express.Multer.File) {
    console.log('Received file:', file); // Log the file object
    this.storageService.upload(file);
    // return this.storageService.upload(file);
  }

  @Get()
  async list() {
    return '---'
    // return this.storageService.list();
  }

  @Delete(':filename')
  async delete(filename: string) {
    return '-----'
    // return this.storageService.delete(filename);
  }
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  create(@Body() createStorageDto: CreateStorageDto) {
    console.log('Received file:', createStorageDto); // Log the file object
    // return this.storageService.create(createStorageDto);
  }

  // @Get()
  // findAll() {
  //   return this.storageService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.storageService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateStorageDto: UpdateStorageDto) {
  //   return this.storageService.update(+id, updateStorageDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.storageService.remove(+id);
  // }
}
