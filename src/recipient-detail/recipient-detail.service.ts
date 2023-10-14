import { Injectable } from '@nestjs/common';
import { CreateRecipientDetailDto } from './dto/create-recipient-detail.dto';
import { UpdateRecipientDetailDto } from './dto/update-recipient-detail.dto';

@Injectable()
export class RecipientDetailService {
  create(createRecipientDetailDto: CreateRecipientDetailDto) {
    return 'This action adds a new recipientDetail';
  }

  findAll() {
    return `This action returns all recipientDetail`;
  }

  findOne(id: number) {
    return `This action returns a #${id} recipientDetail`;
  }

  update(id: number, updateRecipientDetailDto: UpdateRecipientDetailDto) {
    return `This action updates a #${id} recipientDetail`;
  }

  remove(id: number) {
    return `This action removes a #${id} recipientDetail`;
  }
}
