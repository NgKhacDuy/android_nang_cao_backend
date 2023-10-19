import { Module } from '@nestjs/common';
import { RecipientBillService } from './recipient-bill.service';
import { RecipientBillController } from './recipient-bill.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecipientBill } from './entities/recipient-bill.entity';
import { Product } from 'src/product/entities/product.entity';
import { Category } from 'src/category/entities/category.entity';
import { RecipientDetail } from 'src/recipient-detail/entities/recipient-detail.entity';
import { Supplier } from 'src/supplier/entities/supplier.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      RecipientBill,
      Product,
      Category,
      RecipientDetail,
      Supplier,
    ]),
  ],
  controllers: [RecipientBillController],
  providers: [RecipientBillService],
  exports: [RecipientBillService],
})
export class RecipientBillModule {}
