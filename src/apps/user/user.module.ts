import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { ApiExtraModels } from '@nestjs/swagger';
// import { PaginatedResponseDto } from './dto/create-user.dto';
// @ApiExtraModels(PaginatedResponseDto)
@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
