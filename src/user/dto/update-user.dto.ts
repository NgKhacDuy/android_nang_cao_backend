import { PartialType } from '@nestjs/mapped-types';
import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { GENDER } from 'src/utilities/common/user-gender.enum';

export class UpdateUserDto {
  @IsString()
  name: string;
  @IsString()
  phoneNumber: string;
}
