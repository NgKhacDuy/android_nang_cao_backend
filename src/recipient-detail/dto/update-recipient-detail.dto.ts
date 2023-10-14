import { PartialType } from '@nestjs/swagger';
import { CreateRecipientDetailDto } from './create-recipient-detail.dto';

export class UpdateRecipientDetailDto extends PartialType(
  CreateRecipientDetailDto,
) {}
