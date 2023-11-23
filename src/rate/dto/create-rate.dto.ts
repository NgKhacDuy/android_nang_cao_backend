import { IsNumber, IsString } from 'class-validator';

export class CreateRateDto {
  @IsNumber()
  productId: number;
  @IsNumber()
  rate: number;
  @IsString()
  comment: string;
}
