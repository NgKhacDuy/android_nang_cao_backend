import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { Friend } from 'src/friend/entities/friend.entity';
import { Room } from 'src/chat/entities/room.entity';
import { ImagekitService } from 'src/imagekit/imagekit.service';
import { OtpService } from 'src/otp/otp.service';
import { Message } from 'src/message/entities/message.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Friend, Room, Message]),
    JwtModule.register({ secret: process.env.ACCESS_TOKEN_SECRET_KEY }),
  ],
  controllers: [UserController],
  providers: [UserService, ImagekitService, OtpService],
  exports: [UserService],
})
export class UserModule {}
