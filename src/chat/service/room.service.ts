import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Room } from '../entities/room.entity';
import { ArrayContains, FindOptionsWhere, Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { Message } from 'src/message/entities/message.entity';
import { CreateMessageDto } from 'src/message/dto/create-message.dto';
import { GetMessageDto } from '../dto/get-message.dto';

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

  async getMessageForRoom(dto: GetMessageDto) {
    try {
      const room = await this.roomRepository.findOneBy({
        id: dto.roomId,
      });
      const message = await this.messageRepository.findBy({
        room: room,
      } as FindOptionsWhere<Room>);
      return message;
    } catch (error) {
      console.log(error);
    }
  }
}
