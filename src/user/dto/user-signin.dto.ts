import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class UserSignInDto{
    @IsNotEmpty()
    @IsString()
    username:string;
    @IsNotEmpty()
    password:string;
}