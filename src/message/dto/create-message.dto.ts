import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { UUID } from 'crypto';

export class CreateMessageDto {
  @IsUUID()
  @IsNotEmpty()
  senderId: UUID;
  content: string;
  type: string;
  image: [];
  @IsNotEmpty()
  @IsString()
  roomId: string;
}
