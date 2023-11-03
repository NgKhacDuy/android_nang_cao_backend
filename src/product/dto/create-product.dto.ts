import { IsArray, IsNumber, IsString } from 'class-validator';

export class CreateProductDto {
  @IsNumber()
  categoryId: number;
  @IsString()
  name: string;
  @IsArray()
  size: string[];
  @IsString()
  description: string;
  @IsString()
  benefit: string;
  @IsArray()
  img: string[];
  @IsArray()
  color: string[];
  @IsString()
  money: string;
  @IsNumber()
  quantity: number;
}
