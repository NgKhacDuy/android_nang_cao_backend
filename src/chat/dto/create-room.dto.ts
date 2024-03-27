import { UUID } from 'crypto';

export class CreateRoomDto {
  name: string;
  listUser: UUID[];
}
