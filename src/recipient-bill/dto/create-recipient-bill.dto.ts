import {
  IsArray,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';
import { ProductRecipientBillDto } from './product-recipient-bill.dto';

export class CreateRecipientBillDto {
  @IsNotEmpty()
  @IsNumber()
  supplierId: number;
  @IsNotEmpty()
  totalMoney: string;
  @IsNotEmpty()
  @IsArray()
  listProduct: Array<ProductRecipientBillDto>;
}
