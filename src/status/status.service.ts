import { Injectable } from '@nestjs/common';
import { CreateStatusDto } from './dto/create-status.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { Response } from 'express';
import { SuccessResponse } from 'src/constants/reponse.constants';

@Injectable()
export class StatusService {
  findAll(res: Response) {
    return res.status(200).send(SuccessResponse('Server started'));
  }
}
