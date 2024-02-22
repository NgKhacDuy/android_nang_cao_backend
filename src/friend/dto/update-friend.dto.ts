import { PartialType } from '@nestjs/swagger';
import { CreateFriendDto } from './create-friend.dto';
import { IsEnum } from 'class-validator';
import { FriendStatusDtoEnum } from 'src/utilities/common/friend-status_dto.enum';

export class UpdateFriendDto {
  @IsEnum(FriendStatusDtoEnum)
  status: FriendStatusDtoEnum;
}
