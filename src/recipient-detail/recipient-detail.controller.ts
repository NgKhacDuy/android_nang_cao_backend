import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { RecipientDetailService } from './recipient-detail.service';
import { CreateRecipientDetailDto } from './dto/create-recipient-detail.dto';
import { UpdateRecipientDetailDto } from './dto/update-recipient-detail.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('recipient-detail')
@Controller('recipient-detail')
export class RecipientDetailController {
  constructor(
    private readonly recipientDetailService: RecipientDetailService,
  ) {}

  @Get()
  findAll() {
    return this.recipientDetailService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.recipientDetailService.findOne(+id);
  }
}
