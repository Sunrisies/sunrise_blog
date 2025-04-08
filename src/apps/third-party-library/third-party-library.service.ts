import { Injectable } from '@nestjs/common';
import { CreateThirdPartyLibraryDto } from './dto/create-third-party-library.dto';
import { UpdateThirdPartyLibraryDto } from './dto/update-third-party-library.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ThirdPartyLibrary } from './entities/third-party-library.entity';
import { Repository } from 'typeorm';
import { Category } from '../categories/entities/category.entity';

@Injectable()
export class ThirdPartyLibraryService {
  // constructor(
  //   @InjectRepository(ThirdPartyLibrary)
  //   private libraryRepository: Repository<ThirdPartyLibrary>,
  //   @InjectRepository(Category)
  //   private categoryRepository: Repository<Category>
  // ) { }
  create(createThirdPartyLibraryDto: CreateThirdPartyLibraryDto) {
    return 'This action adds a new thirdPartyLibrary';
  }

  findAll() {
    return `This action returns all thirdPartyLibrary`;
  }

  findOne(id: number) {
    return `This action returns a #${id} thirdPartyLibrary`;
  }

  update(id: number, updateThirdPartyLibraryDto: UpdateThirdPartyLibraryDto) {
    return `This action updates a #${id} thirdPartyLibrary`;
  }

  remove(id: number) {
    return `This action removes a #${id} thirdPartyLibrary`;
  }
}
