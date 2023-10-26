import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateQuantityCartDto {
  @IsNumber()
  @IsNotEmpty()
  productId: number;
  @IsNumber()
  @IsNotEmpty()
  quantity: number;
}
