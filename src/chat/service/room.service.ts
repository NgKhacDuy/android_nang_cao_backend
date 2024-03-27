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
import { CreateRoomDto } from '../dto/create-room.dto';
import axios from 'axios';

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(Room) private readonly roomRepository: Repository<Room>,
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
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
    try {
      let data = JSON.stringify({
        app_id: process.env.ONESIGNAL_APP_ID,
        include_subscription_ids: listUser,
        contents: {
          en: `${message}`,
        },
      });

      let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://onesignal.com/api/v1/notifications',
        headers: {
          Authorization: `Basic ${process.env.ONESIGNAL_REST_API_KEY}`,
          accept: 'application/json',
          'content-type': 'application/json',
        },
        data: data,
      };

      axios
        .request(config)
        .then((response) => {
          console.log(JSON.stringify(response.data));
        })
        .catch((error) => {
          console.log(error);
        });

      console.log('noti sent successfully');
    } catch (error) {
      console.log('noti sent failed');
      console.log(error);
    }
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
      for (const e of listUser.listUsers) {
        const user = await this.userRepository.findOneBy({ id: e });
        if (user.appId != '') {
          if (user.id != senderId) {
            listUserId.push(user.appId);
          }
        }
      }
      if (listUserId.length > 0) {
        console.log('ready for notification');
        await this.createNotification(
          `${sender.name} đã gửi tin nhắn đến bạn`,
          listUserId,
        );
      }
      const message = await this.messageRepository.findBy({
        room: room,
      } as FindOptionsWhere<Room>);
      return message;
    } catch (error) {
      console.log(error);
    }
  }

  async createRoom(dto: CreateRoomDto) {
    try {
      const room = new Room();
      room.name = dto.name;
      room.isGroup = dto.listUser.length > 2;
      room.listUsers = dto.listUser;
      await this.roomRepository.save(room);
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  }
}
