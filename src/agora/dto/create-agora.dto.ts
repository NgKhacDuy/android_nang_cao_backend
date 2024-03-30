import { IsNotEmpty, IsString } from 'class-validator';

export class CreateAgoraDto {
  @IsNotEmpty()
  @IsString()
  channelName: string;
}
