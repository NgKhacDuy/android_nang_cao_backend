import { IsNotEmpty, IsString } from 'class-validator';

export class UserRefreshDto {
  @IsNotEmpty()
  @IsString()
  refreshToken: string;
}
