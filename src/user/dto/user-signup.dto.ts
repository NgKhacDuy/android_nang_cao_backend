import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumberString,
  IsString,
} from 'class-validator';
import { GENDER } from 'src/utilities/common/user-gender.enum';

export class UserSignUpDto {
  @IsNotEmpty()
  @IsString()
  name: string;
  @IsNotEmpty()
  password: string;
  @IsNotEmpty()
  @IsNumberString()
  phoneNumber: string;
}
