import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateFriendDto } from './dto/create-friend.dto';
import { UpdateFriendDto } from './dto/update-friend.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { Friend } from './entities/friend.entity';
import { Response } from 'express';
import {
  BadRequestResponse,
  NotFoundResponse,
  SuccessResponse,
} from 'src/constants/reponse.constants';
import { UUID } from 'crypto';
import { FriendStatusDtoEnum } from 'src/utilities/common/friend-status_dto.enum';
import { FriendStatus } from 'src/utilities/common/friend-status.enum';

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

  findOne(id: UUID) {
    return `This action returns a #${id} friend`;
  }

  async update(
    id: string,
    status: FriendStatusDtoEnum,
    currentUser: User,
    res: Response,
  ) {
    try {
      if (id == currentUser.id) {
        return res
          .status(400)
          .send(BadRequestResponse('You can not accept or deny your self'));
      }
      const friendInvitation = await this.friendRepository.findOne({
        where: [
          { idReceiver: id, idSender: currentUser.id },
          { idReceiver: currentUser.id, idSender: id },
        ],
      });
      if (!friendInvitation) {
        return res
          .status(404)
          .send(NotFoundResponse('Friend Invitation not found'));
      }
      if (friendInvitation.idSender == currentUser.id) {
        return res
          .status(400)
          .send(BadRequestResponse('Id sender must not be your self'));
      }
      if (status == FriendStatusDtoEnum.REJECT) {
        await this.friendRepository.remove([friendInvitation]);
        return res.status(200).send(SuccessResponse('Rejected Successfully'));
      } else {
        friendInvitation.status = FriendStatus.ACCEPTED;
        await this.friendRepository.save(friendInvitation);
        return res.status(200).send(SuccessResponse('Accepted Successfully'));
      }
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  }

  remove(id: number) {
    return `This action removes a #${id} friend`;
  }
}
