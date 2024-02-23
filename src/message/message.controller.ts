import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
} from '@nestjs/common';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { CurrentUser } from 'src/utilities/decorators/current-user.decorators';
import { User } from 'src/user/entities/user.entity';
import { Response } from 'express';

@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post()
  create(
    // @Body() createMessageDto: CreateMessageDto,
    // @CurrentUser() currentUser: User,
    @Res() res: Response,
  ) {
    return this.messageService.create(
      // createMessageDto, 
      // currentUser, 
      res);
  }

  @Get()
  findAll(
    @CurrentUser() currentUser: User, 
    @Res() res: Response) {
    return this.messageService.findAll(currentUser, res);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.messageService.remove(+id);
  }
}

