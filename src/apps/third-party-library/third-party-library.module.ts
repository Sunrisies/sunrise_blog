import { Module } from '@nestjs/common';
import { ThirdPartyLibraryService } from './third-party-library.service';
import { ThirdPartyLibraryController } from './third-party-library.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThirdPartyLibrary } from './entities/third-party-library.entity';
import { Category } from '../categories/entities/category.entity';
import { Tag } from '../tags/entities/tag.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ThirdPartyLibrary]),
    TypeOrmModule.forFeature([Category]),
    TypeOrmModule.forFeature([Tag]),
  ],
  controllers: [ThirdPartyLibraryController],
  providers: [ThirdPartyLibraryService],
})
export class ThirdPartyLibraryModule {}
