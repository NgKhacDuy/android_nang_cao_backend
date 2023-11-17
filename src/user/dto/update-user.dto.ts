import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { GENDER } from 'src/utilities/common/user-gender.enum';

export class UpdateUserDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @IsString()
  name: string;
  @IsString()
  phoneNumber: string;
  @IsNotEmpty()
  @IsEnum(GENDER)
  gender: GENDER;
}
