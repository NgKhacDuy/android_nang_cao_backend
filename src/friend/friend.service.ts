import { Injectable } from '@nestjs/common';
import { CreateFriendDto } from './dto/create-friend.dto';
import { UpdateFriendDto } from './dto/update-friend.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { Friend } from './entities/friend.entity';
import { Response } from 'express';
import {
  NotFoundResponse,
  SuccessResponse,
} from 'src/constants/reponse.constants';

@Injectable()
export class FriendService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Friend) private friendRepository: Repository<Friend>,
  ) {}
  async create(
    createFriendDto: CreateFriendDto,
    res: Response,
    currentUser: User,
  ) {
    try {
      const userExist = await this.userRepository.findOneBy({
        id: createFriendDto.userId,
      });
      if (!userExist) {
        return res.status(404).send(NotFoundResponse('User does not exist'));
      }
      const newFriend = new Friend();
      newFriend.user = currentUser;
      newFriend.idSender = currentUser.id;
      newFriend.idReceiver = createFriendDto.userId;
      await this.friendRepository.save(newFriend);
      return res.status(200).send(SuccessResponse());
    } catch (error) {
      console.log(error);
    }
  }

  async findAll(res: Response, currentUser: User) {
    try {
      const friends = await this.friendRepository.find({
        where: [{ idReceiver: currentUser.id }, { idSender: currentUser.id }],
        order: {
          status: 'DESC',
        },
      });
      const listUser = [];
      if (friends) {
        await Promise.all(
          friends.map(async (element) => {
            if (element.idReceiver == currentUser.id) {
              const user = await this.userRepository.findOneBy({
                id: element.idSender,
              });
              listUser.push({ user, status: element.status });
            } else {
              const user = await this.userRepository.findOneBy({
                id: element.idReceiver,
              });
              listUser.push({ user, status: element.status });
            }
          }),
        );
      }
      return res.status(200).send(SuccessResponse(listUser));
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} friend`;
  }

  update(id: number, updateFriendDto: UpdateFriendDto) {
    return `This action updates a #${id} friend`;
  }

  remove(id: number) {
    return `This action removes a #${id} friend`;
  }
}
