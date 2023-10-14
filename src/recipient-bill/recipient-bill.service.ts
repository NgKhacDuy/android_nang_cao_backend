import { Injectable } from '@nestjs/common';
import { CreateRecipientBillDto } from './dto/create-recipient-bill.dto';
import { UpdateRecipientBillDto } from './dto/update-recipient-bill.dto';

@Injectable()
export class RecipientBillService {
  create(createRecipientBillDto: CreateRecipientBillDto) {
    return 'This action adds a new recipientBill';
  }

  findAll() {
    return `This action returns all recipientBill`;
  }

  findOne(id: number) {
    return `This action returns a #${id} recipientBill`;
  }

  update(id: number, updateRecipientBillDto: UpdateRecipientBillDto) {
    return `This action updates a #${id} recipientBill`;
  }

  remove(id: number) {
    return `This action removes a #${id} recipientBill`;
  }
}
