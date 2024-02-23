import { Module } from '@nestjs/common';
import { ChatGateway } from './gateway/chat/chat.gateway';
import { UserModule } from 'src/user/user.module';

@Module({ imports: [UserModule], providers: [ChatGateway] })
export class ChatModule {}

