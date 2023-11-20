import { IsArray, IsNotEmpty, IsString } from 'class-validator';
import { CreateCartDetailDto } from 'src/cart_detail/dto/create-cart_detail.dto';

export class CreateCartDto {
  @IsNotEmpty()
  product: CreateCartDetailDto;
  // @IsNotEmpty()
  // @IsString()
  // totalMoney: string;
  @IsNotEmpty()
  @IsString()
  color: string;
}
