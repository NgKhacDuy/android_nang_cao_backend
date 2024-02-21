import { IsEmail, IsNotEmpty, IsNumberString } from 'class-validator';

export class UserResetPasswordDto {
  @IsNotEmpty()
  @IsNumberString()
  phoneNumber: string;
}
