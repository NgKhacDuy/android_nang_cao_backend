import { Module } from '@nestjs/common';
import { ChatGateway } from './gateway/chat/chat.gateway';
import { UserModule } from 'src/user/user.module';
import { RoomService } from './service/room.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Room } from './entities/room.entity';
import { MessageService } from 'src/message/message.service';
import { MessageModule } from 'src/message/message.module';
import { Message } from 'src/message/entities/message.entity';
import { User } from 'src/user/entities/user.entity';
import { OneSignalModule } from 'onesignal-api-client-nest';

@Module({
  imports: [
    MessageModule,
    UserModule,
    TypeOrmModule.forFeature([Room, Message, User]),
  ],
  providers: [ChatGateway, RoomService, MessageService],
})
export class ChatModule {}
