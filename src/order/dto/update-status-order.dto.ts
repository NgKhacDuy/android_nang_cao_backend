import { IsString } from 'class-validator';

export class UpdateStatusOrderDto {
  @IsString()
  reasons: string;
}
