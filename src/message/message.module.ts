import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Room } from 'src/chat/entities/room.entity';
import { Message } from './entities/message.entity';
import { ImagekitService } from 'src/imagekit/imagekit.service';
import { Image } from 'src/image/entities/image.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Room, Message, Image])],
  controllers: [MessageController],
  providers: [MessageService, ImagekitService],
})
export class MessageModule {}
