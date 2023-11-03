import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCategoryDto {
  @IsNotEmpty()
  @IsString()
  name: string;
  @IsNotEmpty()
  @IsString()
  title: string;
  @IsNotEmpty()
  @IsString()
  subTitle: string;
}
