import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Room } from '../entities/room.entity';
import { ArrayContains, FindOptionsWhere, Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { Message } from 'src/message/entities/message.entity';
import { CreateMessageDto } from 'src/message/dto/create-message.dto';
import { GetMessageDto } from '../dto/get-message.dto';
import { OneSignalService } from 'onesignal-api-client-nest';
import { NotificationBySegmentBuilder } from 'onesignal-api-client-core';

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(Room) private readonly roomRepository: Repository<Room>,
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly oneSignalService: OneSignalService,
  ) {}

  async getRoomForUser(userId: String) {
    try {
      const rooms = await this.roomRepository.find({
        where: { listUsers: ArrayContains([userId]) },
        relations: ['messages'], // Eagerly load messages
        order: { messages: { createAt: 'DESC' } }, // Order messages by createAt (latest first)
      });

      // Extract only the last message from each room efficiently using map
      const roomsWithLastMessagePromise = rooms.map(async (room) => {
        const lastMessage = room.messages.length > 0 ? room.messages[0] : null;
        if (room.isGroup == false) {
          const partnerId =
            room.listUsers[0] === userId
              ? room.listUsers[1]
              : room.listUsers[0];
          const partner = await this.userRepository.findOneBy({
            id: partnerId,
          });
          return { ...room, lastMessage, partner };
        } else {
          return { ...room, lastMessage }; // Spread room properties and add lastMessage
        }
      });
      const roomsWithLastMessage = await Promise.all(
        roomsWithLastMessagePromise,
      );

      return roomsWithLastMessage;
    } catch (error) {
      console.log(error);
    }
  }

  async createNotification(message: string, listUser: string[]) {
    const input = new NotificationBySegmentBuilder()
      .setIncludedSegments(listUser)
      .notification()
      .setContents({ en: message })
      .build();

    await this.oneSignalService.createNotification(input);
  }

  async getMessageForRoom(dto: string) {
    try {
      const room = await this.roomRepository.findOne({
        where: {
          id: dto,
        },
      });
      const message = await this.messageRepository.findBy({
        room: room,
      } as FindOptionsWhere<Room>);
      return message;
    } catch (error) {
      console.log(error);
    }
  }

  async sendMessage(roomId: string, senderId: string) {
    try {
      const room = await this.roomRepository.findOne({
        where: {
          id: roomId,
        },
      });
      const sender = await this.userRepository.findOneBy({ id: senderId });
      const listUser = await this.roomRepository.findOneBy({ id: roomId });
      var listUserId = [];
      Promise.all(
        listUser.listUsers.map(async (e) => {
          const user = await this.userRepository.findOneBy({ id: e });
          listUserId.push(user.appId);
        }),
      );
      await this.createNotification(
        `${sender.name} đã gửi tin nhắn đến bạn`,
        listUserId,
      );
      const message = await this.messageRepository.findBy({
        room: room,
      } as FindOptionsWhere<Room>);
      return message;
    } catch (error) {
      console.log(error);
    }
  }
}
