import { PartialType } from '@nestjs/swagger';
import { CreateCartDetailDto } from './create-cart_detail.dto';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateCartDetailDto {
  @IsNotEmpty()
  @IsNumber()
  id: number;
  @IsNotEmpty()
  @IsNumber()
  quantity: number;
}
