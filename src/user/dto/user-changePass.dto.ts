import { IsNotEmpty } from "class-validator";

export class UserChangePassDto {
  @IsNotEmpty()
  password: string;
}
