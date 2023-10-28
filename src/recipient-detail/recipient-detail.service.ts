import { Injectable } from '@nestjs/common';
import { CreateRecipientDetailDto } from './dto/create-recipient-detail.dto';
import { UpdateRecipientDetailDto } from './dto/update-recipient-detail.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RecipientDetail } from './entities/recipient-detail.entity';
import {
  BadRequestResponse,
  NotFoundResponse,
  SuccessResponse,
} from 'src/constants/reponse.constants';

@Injectable()
export class RecipientDetailService {
  constructor(
    @InjectRepository(RecipientDetail)
    private recipientDetailRepository: Repository<RecipientDetail>,
  ) {}
  async findAll() {
    try {
      const recipient_detail = await this.recipientDetailRepository.find({});
      if (recipient_detail && recipient_detail.length > 0) {
        return SuccessResponse(recipient_detail);
      }
      return NotFoundResponse('Recipient Detail Not Found');
    } catch (error) {
      console.log(error);
      return BadRequestResponse();
    }
  }

  async findOne(id: number) {
    try {
      const recipient_detail = await this.recipientDetailRepository.findOneBy({
        id: id,
      });
      if (recipient_detail) {
        return SuccessResponse(recipient_detail);
      }
      return NotFoundResponse('Recipient Detail Not Found');
    } catch (error) {
      console.log(error);
      return BadRequestResponse();
    }
  }
}
