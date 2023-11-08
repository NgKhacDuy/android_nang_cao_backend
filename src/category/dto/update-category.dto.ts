import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdateCategoryDto {
  @IsNotEmpty()
  @IsString()
  name: string;
  @IsNotEmpty()
  @IsString()
  title: string;
  @IsNotEmpty()
  @IsString()
  subTitle: string;
  @IsNotEmpty()
  @IsString()
  slug: string;
}
