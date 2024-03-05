import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Room } from 'src/chat/entities/room.entity';
import { Message } from './entities/message.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Room, Message])],
  controllers: [MessageController],
  providers: [MessageService],
})
export class MessageModule {}
