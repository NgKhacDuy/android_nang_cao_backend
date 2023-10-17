import { IsArray, IsNumber, IsString } from 'class-validator';

export class CreateProductDto {
  @IsNumber()
  categoryId: number;
  @IsString()
  name: string;
  @IsString()
  size: string;
  @IsString()
  description: string;
  @IsString()
  benefit: string;
  @IsArray()
  img: string[];
  @IsString()
  money: string;
  @IsNumber()
  quantity: number;
}
