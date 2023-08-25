import { PartialType } from '@nestjs/swagger';
import { CreateCastDto } from './create-cast.dto';

export class UpdateCastDto extends PartialType(CreateCastDto) {}
