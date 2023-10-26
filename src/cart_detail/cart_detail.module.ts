import { Module } from '@nestjs/common';
import { CartDetailService } from './cart_detail.service';
import { CartDetailController } from './cart_detail.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartDetail } from './entities/cart_detail.entity';
import { Cart } from 'src/cart/entities/cart.entity';
import { Product } from 'src/product/entities/product.entity';
import { User } from 'src/user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CartDetail, Cart, Product, User])],
  controllers: [CartDetailController],
  providers: [CartDetailService],
  exports: [CartDetailService],
})
export class CartDetailModule {}
