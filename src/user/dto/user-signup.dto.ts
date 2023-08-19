import { BadRequestException } from "@nestjs/common";
import { IsNotEmpty } from "class-validator";

export class UserSignUp{
    @IsNotEmpty()
    username:string;
    @IsNotEmpty()
    password:string;
    @IsNotEmpty()
    name:string;
}