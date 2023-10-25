import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateCartDetailDto {
  @IsNotEmpty()
  @IsNumber()
  productId: number;
  @IsNotEmpty()
  @IsNumber()
  quantity: number;
  @IsNotEmpty()
  @IsString()
  money: string;
}
