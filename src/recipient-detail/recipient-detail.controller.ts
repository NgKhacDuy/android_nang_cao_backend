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

  @Post()
  create(@Body() createRecipientDetailDto: CreateRecipientDetailDto) {
    return this.recipientDetailService.create(createRecipientDetailDto);
  }

  @Get()
  findAll() {
    return this.recipientDetailService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.recipientDetailService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateRecipientDetailDto: UpdateRecipientDetailDto,
  ) {
    return this.recipientDetailService.update(+id, updateRecipientDetailDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.recipientDetailService.remove(+id);
  }
}
