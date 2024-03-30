import { PartialType } from '@nestjs/swagger';
import { CreateAgoraDto } from './create-agora.dto';

export class UpdateAgoraDto extends PartialType(CreateAgoraDto) {}
