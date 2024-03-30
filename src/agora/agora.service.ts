import { Injectable } from '@nestjs/common';
import { CreateAgoraDto } from './dto/create-agora.dto';
import { UpdateAgoraDto } from './dto/update-agora.dto';
import { Agora } from './entities/agora.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RtcRole, RtcTokenBuilder } from 'agora-access-token';
import { channel } from 'diagnostics_channel';
import { Response } from 'express';

@Injectable()
export class AgoraService {
  constructor(
    @InjectRepository(Agora)
    private readonly agoraRepository: Repository<Agora>,
  ) {}
  async findOne(name: string, res: Response) {
    try {
      let role = RtcRole.PUBLISHER;
      let expireTime = 3600;
      const token = RtcTokenBuilder.buildTokenWithUid(
        process.env.AGORA_APP_ID,
        process.env.AGORA_APP_CERT,
        name,
        0,
        role,
        expireTime,
      );
      return res.status(200).send({ token });
    } catch (error) {}
  }
}
