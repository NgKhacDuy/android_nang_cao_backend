import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Room } from '../entities/room.entity';
import { ArrayContains, FindOptionsWhere, Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { Message } from 'src/message/entities/message.entity';
import { CreateMessageDto } from 'src/message/dto/create-message.dto';
import { GetMessageDto } from '../dto/get-message.dto';
import { CreateRoomDto } from '../dto/create-room.dto';
import axios from 'axios';
import { OnesignalService } from 'src/onesignal/onesignal.service';
import { AddUserToGroup } from '../dto/add-user.dto';
import { UUID } from 'crypto';
import { RemoveUserOutGroup } from '../dto/remove-user.dto';

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(Room) private readonly roomRepository: Repository<Room>,
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly onesignalService: OnesignalService,
  ) {}

  async getRoomForUser(userId: String) {
    try {
      const rooms = await this.roomRepository.find({
        where: { listUsers: ArrayContains([userId]) },
        relations: ['messages', 'user'], // Eagerly load messages
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
          if (room.listUsers[0] === userId) {
            room.isOwner = true;
          }
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

  async getMessageForRoom(dto: string) {
    try {
      const room = await this.roomRepository.findOne({
        where: {
          id: dto,
        },
      });
      const message = await this.messageRepository.find({
        relations: { images: true },
        where: {
          room: room,
        } as FindOptionsWhere<Room>,
        order: {
          createAt: 'asc',
        },
      });
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
        if (room.isGroup == false) {
          await this.onesignalService.createNotification(
            sender.name,
            'Đã gửi tin nhắn đến bạn',
            listUserId,
            'message',
            roomId,
          );
        } else {
          await this.onesignalService.createNotification(
            sender.name,
            `Đã gửi tin nhắn đến ${room.name}`,
            listUserId,
            'message',
            roomId,
          );
        }
      }
      const message = await this.messageRepository.find({
        relations: { images: true },
        where: {
          room: room,
        } as FindOptionsWhere<Room>,
        order: {
          createAt: 'asc',
        },
      });
      return message;
    } catch (error) {
      console.log(error);
    }
  }

  async createRoom(dto: CreateRoomDto) {
    try {
      var listUser = [];
      for (const e of dto.listUser) {
        const user = await this.userRepository.findOneBy({ id: e });
        listUser.push(user);
      }
      const room = new Room();
      room.name = dto.name;
      room.isGroup = dto.listUser.length > 2;
      room.listUsers = dto.listUser;
      room.user = listUser;
      await this.roomRepository.save(room);
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  }

  async addUserToGroup(dto: AddUserToGroup) {
    try {
      const room = await this.roomRepository.findOne({
        where: { id: dto.idRoom },
        relations: { user: true },
      });
      for (const e of dto.idUser) {
        const user = await this.userRepository.findOneBy({ id: e });
        room.listUsers.push(user.id as UUID);
        room.user.push(user);
      }
      await this.roomRepository.save(room);
      this.onesignalService.createNotification(
        'Nhóm mới',
        `Bạn đã được thêm vào nhóm ${room.name}`,
        dto.idUser,
        'add_user_to_group',
        '',
      );
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  }

  async removeUser(dto: RemoveUserOutGroup) {
    try {
      const room = await this.roomRepository.findOne({
        where: { id: dto.idRoom },
        relations: { user: true },
      });
      const user = await this.userRepository.findOneBy({ id: dto.idUser });
      room.listUsers = room.listUsers.filter((e) => e !== user.id);
      room.user = room.user.filter((e) => e.id !== user.id);
      await this.roomRepository.save(room);
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  }
}
