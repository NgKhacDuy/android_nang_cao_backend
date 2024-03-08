import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { ArrayContains, Repository } from 'typeorm';
import { Room } from 'src/chat/entities/room.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Room) private readonly roomRepository: Repository<Room>,
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
  ) {}
  async create(dto: CreateMessageDto) {
    try {
      let roomExist = await this.roomRepository.findOne({
        where: [
          {
            listUsers: ArrayContains([dto.senderId, dto.receiverId]),
          },
          {
            listUsers: ArrayContains([dto.receiverId, dto.senderId]),
          },
        ],
      });
      if (!roomExist) {
        roomExist = new Room();
        roomExist.isGroup = false;
        roomExist.listUsers = [dto.senderId, dto.receiverId];
        roomExist.name = `["${dto.senderId}", "${dto.receiverId}"]`;
        await this.roomRepository.save(roomExist);
      }
      const message = new Message();
      message.senderId = dto.senderId;
      message.content = dto.content;
      message.readBy = [];
      message.room = roomExist;
      await this.messageRepository.save(message);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }
}
