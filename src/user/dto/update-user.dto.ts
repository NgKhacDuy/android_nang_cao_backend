import { PartialType } from '@nestjs/mapped-types';
import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { GENDER } from 'src/utilities/common/user-gender.enum';

export class UpdateUserDto {
  @IsEmail()
  email: string;
  @IsString()
  username: string;
  @IsString()
  firstName: string;
  @IsString()
  lastName: string;
  @IsString()
  phoneNumber: string;
  @IsEnum(GENDER)
  gender: GENDER;
}
