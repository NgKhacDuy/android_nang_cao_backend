import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Room } from '../entities/room.entity';
import { ArrayContains, Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { Message } from 'src/message/entities/message.entity';

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(Room) private readonly roomRepository: Repository<Room>,
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
  ) {}

  async getRoomForUser(userId: String) {
    try {
      const rooms = await this.roomRepository.find({
        where: { listUsers: ArrayContains([userId]) },
        relations: ['messages'], // Eagerly load messages
        order: { messages: { createAt: 'DESC' } }, // Order messages by createAt (latest first)
      });

      // Extract only the last message from each room efficiently using map
      const roomsWithLastMessage = rooms.map((room) => {
        const lastMessage = room.messages.length > 0 ? room.messages[0] : null;
        return { ...room, lastMessage }; // Spread room properties and add lastMessage
      });

      return roomsWithLastMessage;
    } catch (error) {
      console.log(error);
    }
  }
}
