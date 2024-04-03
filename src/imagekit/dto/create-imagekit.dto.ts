import { IsBase64, IsNotEmpty } from 'class-validator';

export class CreateImagekitDto {
  @IsNotEmpty()
  @IsBase64()
  base64: string;
}
