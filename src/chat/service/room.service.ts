import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Room } from '../entities/room.entity';
import { ArrayContains, Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(Room) private readonly roomRepository: Repository<Room>,
  ) {}

  async getRoomForUser(userId: String) {
    try {
      const rooms = await this.roomRepository.find({
        where: [
          {
            listUsers: ArrayContains([userId]),
          },
        ],
      });

      return rooms;
    } catch (error) {}
  }
}
