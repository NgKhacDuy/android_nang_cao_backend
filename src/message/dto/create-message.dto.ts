import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateMessageDto {
  @IsNotEmpty()
  @IsUUID()
  idReceiver: string;
  @IsNotEmpty()
  @IsString()
  content: string;
}

