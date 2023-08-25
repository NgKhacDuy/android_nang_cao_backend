import { Injectable } from '@nestjs/common';
import { CreateHallDto } from './dto/create-hall.dto';
import { UpdateHallDto } from './dto/update-hall.dto';

@Injectable()
export class HallService {
  create(createHallDto: CreateHallDto) {
    return 'This action adds a new hall';
  }

  findAll() {
    return `This action returns all hall`;
  }

  findOne(id: number) {
    return `This action returns a #${id} hall`;
  }

  update(id: number, updateHallDto: UpdateHallDto) {
    return `This action updates a #${id} hall`;
  }

  remove(id: number) {
    return `This action removes a #${id} hall`;
  }
}
