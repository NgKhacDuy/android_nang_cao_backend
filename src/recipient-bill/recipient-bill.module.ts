import { Module } from '@nestjs/common';
import { RecipientBillService } from './recipient-bill.service';
import { RecipientBillController } from './recipient-bill.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecipientBill } from './entities/recipient-bill.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RecipientBill])],
  controllers: [RecipientBillController],
  providers: [RecipientBillService],
  exports: [RecipientBillService],
})
export class RecipientBillModule {}
