import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { User } from 'src/user/entities/user.entity';
import { Response } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  NotFoundResponse,
  SuccessResponse,
} from 'src/constants/reponse.constants';
import { Message } from './entities/message.entity';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Message) private messageRepository: Repository<Message>,
    // Inject the gateway
  ) {}

  async create(
    // createMessageDto: CreateMessageDto,
    // currentUser: User,
    res: Response,
  ) {
    try {
      // const userExist = await this.userRepository.findOneBy({
      //   id: createMessageDto.idReceiver,
      // });
      // if (!userExist) {
      //   return res.status(404).send(NotFoundResponse('User does not exist'));
      // }

      // const newMessage = new Message();
      // newMessage.idSender = currentUser.id;
      // newMessage.idReceiver = createMessageDto.idReceiver;
      // newMessage.content = createMessageDto.content;
      // await this.messageRepository.save(newMessage);
      return res.status(200).send(SuccessResponse());
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async findAll(currentUser: User, res: Response) {
    try {
      const message = await this.messageRepository.find({
        where: [{ idReceiver: currentUser.id }, { idSender: currentUser.id }],
        order: {
          timeSend: 'DESC',
        },
      });
      return res.status(200).send(SuccessResponse(message));
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  }

  remove(id: number) {
    return `This action removes a #${id} message`;
  }
}

