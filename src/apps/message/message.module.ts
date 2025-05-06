import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';
import { User } from '../user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Message]), TypeOrmModule.forFeature([User])],
  controllers: [MessageController],
  providers: [MessageService],
})
export class MessageModule { }
