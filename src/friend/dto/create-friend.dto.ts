import { IsString, IsUUID } from 'class-validator';

export class CreateFriendDto {
  @IsUUID()
  userId: string;
}
