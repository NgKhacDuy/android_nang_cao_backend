import { PartialType } from '@nestjs/swagger';
import { CreateRecipientBillDto } from './create-recipient-bill.dto';

export class UpdateRecipientBillDto extends PartialType(
  CreateRecipientBillDto,
) {}
