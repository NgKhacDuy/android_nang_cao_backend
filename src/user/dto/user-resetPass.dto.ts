import { IsEmail, IsNotEmpty } from 'class-validator';

export class UserResetPasswordDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
