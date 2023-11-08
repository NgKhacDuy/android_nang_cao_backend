import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class UserSignUpDto {
  @IsNotEmpty()
  @IsString()
  username: string;
  @IsNotEmpty()
  password: string;
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @IsNotEmpty()
  @IsString()
  firstName: string;
  @IsNotEmpty()
  @IsString()
  lastName: string;
  @IsNotEmpty()
  @IsString()
  phoneNumber: string;
}
