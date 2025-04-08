import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ThirdPartyLibraryService } from './third-party-library.service';
import { CreateThirdPartyLibraryDto } from './dto/create-third-party-library.dto';
import { UpdateThirdPartyLibraryDto } from './dto/update-third-party-library.dto';

@Controller('third-party-library')
export class ThirdPartyLibraryController {
  constructor(private readonly thirdPartyLibraryService: ThirdPartyLibraryService) {}

  @Post()
  create(@Body() createThirdPartyLibraryDto: CreateThirdPartyLibraryDto) {
    return this.thirdPartyLibraryService.create(createThirdPartyLibraryDto);
  }

  @Get()
  findAll() {
    return this.thirdPartyLibraryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.thirdPartyLibraryService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateThirdPartyLibraryDto: UpdateThirdPartyLibraryDto) {
    return this.thirdPartyLibraryService.update(+id, updateThirdPartyLibraryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.thirdPartyLibraryService.remove(+id);
  }
}
