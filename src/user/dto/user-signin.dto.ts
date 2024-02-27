import { IsNotEmpty, IsNumberString, IsString } from 'class-validator';

export class UserSignInDto {
  @IsNotEmpty()
  @IsNumberString()
  phoneNumber: string;
  @IsNotEmpty()
  password: string;
}
