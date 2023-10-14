import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { RecipientBillService } from './recipient-bill.service';
import { CreateRecipientBillDto } from './dto/create-recipient-bill.dto';
import { UpdateRecipientBillDto } from './dto/update-recipient-bill.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('recipient-bill')
@Controller('recipient-bill')
export class RecipientBillController {
  constructor(private readonly recipientBillService: RecipientBillService) {}

  @Post()
  create(@Body() createRecipientBillDto: CreateRecipientBillDto) {
    return this.recipientBillService.create(createRecipientBillDto);
  }

  @Get()
  findAll() {
    return this.recipientBillService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.recipientBillService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateRecipientBillDto: UpdateRecipientBillDto,
  ) {
    return this.recipientBillService.update(+id, updateRecipientBillDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.recipientBillService.remove(+id);
  }
}
