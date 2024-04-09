import { Module } from '@nestjs/common';
import { FriendService } from './friend.service';
import { FriendController } from './friend.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Friend } from './entities/friend.entity';
import { User } from 'src/user/entities/user.entity';
import { Room } from 'src/chat/entities/room.entity';
import { Image } from 'src/image/entities/image.entity';
import { ImagekitService } from 'src/imagekit/imagekit.service';

@Module({
  imports: [TypeOrmModule.forFeature([Friend, User, Room, Image])],
  controllers: [FriendController],
  providers: [FriendService, ImagekitService],
})
export class FriendModule {}
