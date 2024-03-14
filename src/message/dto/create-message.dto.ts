import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { UUID } from 'crypto';

export class CreateMessageDto {
  @IsUUID()
  @IsNotEmpty()
  senderId: UUID;
  @IsNotEmpty()
  @IsString()
  content: string;
  @IsNotEmpty()
  @IsString()
  roomId: string;
}
