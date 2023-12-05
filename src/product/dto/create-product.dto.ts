import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsString,
} from 'class-validator';

export class CreateProductDto {
  @IsNumberString()
  categoryId: string;
  @IsString()
  name: string;
  @IsString()
  description: string;
  @IsString()
  benefit: string;
  @IsArray()
  color: string[];
  @IsString()
  money: string;
  @IsNumberString()
  quantity: number;
  @IsNotEmpty()
  @IsString()
  slug: string;
  @IsNotEmpty()
  @IsNumberString()
  supplierId: string;
}
