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
            id: dto.roomId,
          },
        ],
      });
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

  convertToValidJson(dataString: string): string | null {
    try {
      // Parse the entire JSON string
      const jsonData = JSON.parse(dataString);

      // Check if the "receiverId" property exists
      if (!jsonData.hasOwnProperty('receiverId')) {
        return dataString; // Return original JSON if "receiverId" is missing
      }

      const receiverIdString = jsonData.receiverId;

      // Check if the receiverId string is a single-element array wrapped in brackets
      if (receiverIdString.length === 2 && receiverIdString === '[]') {
        return dataString; // Return original JSON if "receiverId" is an empty array
      }

      // Check if the receiverId string starts and ends with square brackets
      if (
        receiverIdString.charAt(0) !== '[' ||
        receiverIdString.charAt(receiverIdString.length - 1) !== ']'
      ) {
        return null; // Return null for invalid format
      }

      // Remove the outer square brackets
      const dataWithoutBrackets = receiverIdString.slice(1, -1);

      // Split the string by comma, removing any quotes around the elements
      const dataList = dataWithoutBrackets
        .split(',')
        .map((item) => item.trim().replace(/^"|"$|^'|'$/g, ''));

      // Update the "receiverId" property with the converted list
      jsonData.receiverId = dataList;

      // Stringify the modified JSON object
      return JSON.stringify(jsonData);
    } catch (error) {
      console.error('Error parsing data:', error);
      return null; // Return null on parsing error
    }
  }
}
