import { Injectable } from '@nestjs/common';
import { CreateOrderDetailDto } from './dto/create-order_detail.dto';
import { UpdateOrderDetailDto } from './dto/update-order_detail.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderDetail } from './entities/order_detail.entity';
import {
  BadRequestResponse,
  NotFoundResponse,
  SuccessResponse,
} from 'src/constants/reponse.constants';
import { Product } from 'src/product/entities/product.entity';

@Injectable()
export class OrderDetailService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,

    @InjectRepository(OrderDetail)
    private orderDetailRepository: Repository<OrderDetail>,
  ) {}
  create(createOrderDetailDto: CreateOrderDetailDto) {
    return 'This action adds a new orderDetail';
  }

  async findAll() {
    try {
      const orderDetail = await this.orderDetailRepository.find({});
      if (orderDetail.length === 0 || !orderDetail) {
        return NotFoundResponse('Order Detail not found');
      } else {
        await Promise.all(
          orderDetail.map(async (iterator) => {
            const product = await this.productRepository.findBy({
              id: iterator.productId,
            });
            iterator.product = product;
          }),
        );
        return SuccessResponse(orderDetail);
      }
    } catch (error) {
      console.log(error);
      return BadRequestResponse();
    }
  }

  async findOne(id: number) {
    try {
      const orderDetail = await this.orderDetailRepository.findOneBy({
        id: id,
      });
      if (!orderDetail) {
        return NotFoundResponse('Order Detail not found');
      } else {
        const product = await this.productRepository.findBy({
          id: orderDetail.productId,
        });
        orderDetail.product = product;

        return SuccessResponse(orderDetail);
      }
    } catch (error) {
      console.log(error);
      return BadRequestResponse();
    }
  }

  update(id: number, updateOrderDetailDto: UpdateOrderDetailDto) {
    return `This action updates a #${id} orderDetail`;
  }

  remove(id: number) {
    return `This action removes a #${id} orderDetail`;
  }
}
