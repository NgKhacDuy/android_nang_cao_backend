import { Module } from '@nestjs/common';
import { FriendService } from './friend.service';
import { FriendController } from './friend.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Friend } from './entities/friend.entity';
import { User } from 'src/user/entities/user.entity';
import { Room } from 'src/chat/entities/room.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Friend, User, Room])],
  controllers: [FriendController],
  providers: [FriendService],
})
export class FriendModule {}
