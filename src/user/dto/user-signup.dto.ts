import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { GENDER } from 'src/utilities/common/user-gender.enum';

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
  @IsNotEmpty()
  @IsEnum(GENDER)
  gender: GENDER;
}
