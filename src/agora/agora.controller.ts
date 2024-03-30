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
import { AgoraService } from './agora.service';
import { CreateAgoraDto } from './dto/create-agora.dto';
import { UpdateAgoraDto } from './dto/update-agora.dto';
import { Response } from 'express';

@Controller('agora')
export class AgoraController {
  constructor(private readonly agoraService: AgoraService) {}

  @Get(':name')
  findOne(@Param('name') name: string, @Res() res: Response) {
    return this.agoraService.findOne(name, res);
  }
}
