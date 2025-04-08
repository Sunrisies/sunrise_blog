import { Module } from '@nestjs/common';
import { ThirdPartyLibraryService } from './third-party-library.service';
import { ThirdPartyLibraryController } from './third-party-library.controller';

@Module({
  controllers: [ThirdPartyLibraryController],
  providers: [ThirdPartyLibraryService],
})
export class ThirdPartyLibraryModule {}
