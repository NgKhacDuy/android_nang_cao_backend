import { Injectable } from '@nestjs/common';
import { CreateAgoraDto } from './dto/create-agora.dto';
import { UpdateAgoraDto } from './dto/update-agora.dto';
import { Agora } from './entities/agora.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RtcRole, RtcTokenBuilder } from 'agora-access-token';
import { channel } from 'diagnostics_channel';
import { Response } from 'express';
import { SuccessResponse } from 'src/constants/reponse.constants';

@Injectable()
export class AgoraService {
  constructor(
    @InjectRepository(Agora)
    private readonly agoraRepository: Repository<Agora>,
  ) {}
  async findOne(name: string, res: Response) {
    let agora = await this.agoraRepository.findOneBy({ channelName: name });
    if (!agora) {
      agora = new Agora();
      agora.channelName = name;
      agora.expireIn = '3600';
      agora.token = RtcTokenBuilder.buildTokenWithUid(
        process.env.AGORA_APP_ID,
        process.env.AGORA_APP_CERT,
        name,
        0,
        RtcRole.PUBLISHER,
        3600,
      );
      await this.agoraRepository.save(agora);
    } else {
      const expireTime = Number(agora.expireIn);
      const currentTime = Date.now();
      if (currentTime - agora.createdAt.getTime() >= expireTime * 1000) {
        agora.token = RtcTokenBuilder.buildTokenWithUid(
          process.env.AGORA_APP_ID,
          process.env.AGORA_APP_CERT,
          name,
          0,
          RtcRole.PUBLISHER,
          3600,
        );
        await this.agoraRepository.save(agora);
      }
    }
    return res.status(200).send(SuccessResponse({ token: agora.token }));
  }
}
