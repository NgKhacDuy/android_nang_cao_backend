import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { User } from 'src/user/entities/user.entity';
import { Order } from './entities/order.entity';
import { OrderDetail } from 'src/order_detail/entities/order_detail.entity';
import { Cart } from 'src/cart/entities/cart.entity';
import { CartDetail } from 'src/cart_detail/entities/cart_detail.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/product/entities/product.entity';
import { Equal, FindOptionsWhere, Repository } from 'typeorm';
import {
  BadRequestResponse,
  InternalServerErrorReponse,
  NotFoundResponse,
  SuccessResponse,
} from 'src/constants/reponse.constants';
import { StatusOrder } from 'src/utilities/common/status-order.enum';
import { MailService } from 'src/mail/mail.service';
import { ApiInternalServerErrorResponse } from '@nestjs/swagger';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(OrderDetail)
    private orderDetailRepository: Repository<OrderDetail>,
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
    @InjectRepository(CartDetail)
    private cartDetailRepository: Repository<CartDetail>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private mailService: MailService,
  ) {}
  async create(currentUser: User, dto: CreateOrderDto) {
    try {
      const userExist = await this.userRepository.findOneBy({
        id: currentUser.id,
      });
      const cartExist = await this.cartRepository.findOneBy({
        userId: currentUser.id,
      });

      if (!cartExist) {
        return NotFoundResponse('Cart not found');
      }

      if (!userExist) {
        return NotFoundResponse('User not found');
      }
      let listOrderDetail = [];
      let totalMoney = 0;
      const order = new Order();
      let cartDetailTemp = await this.cartDetailRepository.findBy({
        cart: { id: cartExist.id },
      });
      for (let i in cartDetailTemp) {
        let item = cartDetailTemp;
        const product = await this.productRepository.findOneBy({
          id: item[i].productId,
        });
        const orderDetail = new OrderDetail();
        orderDetail.product = item[i].product;
        orderDetail.productId = item[i].productId;
        orderDetail.money = product.money;
        orderDetail.quantity = item[i].quantity;
        orderDetail.productName = product.name;
        orderDetail.color = item[i].color;

        await this.orderDetailRepository.save(orderDetail);
        listOrderDetail.push(orderDetail);
        totalMoney += +product.money * item[i].quantity;
      }
      order.orderDetail = listOrderDetail;
      order.totalMoney = totalMoney.toString();
      order.dateCreate = new Date();
      order.user = currentUser;
      order.address = dto.address;
      await this.orderRepository.save(order);
      cartExist.cartDetail = [];
      await this.cartRepository.delete(cartExist.id);
      await this.cartDetailRepository.remove(cartDetailTemp);
      await this.mailService.sendOrderInfo(currentUser, order);
      return SuccessResponse();
    } catch (error) {
      console.log(error);
      return BadRequestResponse();
    }
  }

  async updateStatus(
    id: number,
    status: StatusOrder,
    reason: string,
    currentUser: User,
  ) {
    try {
      const order = await this.orderRepository.findOneBy({ id: id });
      if (order != null) {
        order.status = status;
        order.reasonCanceled = reason;
        order.nvId = currentUser.id.toString();
        this.orderRepository.save(order);
        return SuccessResponse();
      }
      return NotFoundResponse('Order not found');
    } catch (error) {
      console.log(error);
      return BadRequestResponse();
    }
  }

  async findAll(page: number) {
    try {
      if (page <= 0) {
        return BadRequestResponse('Page must be greater than zero');
      }
      const [order, total] = await this.orderRepository.findAndCount({
        take: 10,
        skip: (page - 1) * 10,
      });
      if (order.length > 0 && order) {
        await Promise.all(
          order.map(async (element) => {
            const orderDetail = await this.orderDetailRepository.find({
              where: {
                order: element,
              } as FindOptionsWhere<Order>,
            });

            await Promise.all(
              orderDetail.map(async (iterator) => {
                const product = await this.productRepository.findBy({
                  id: iterator.productId,
                });
                iterator.product = product;
              }),
            );
            element.orderDetail = orderDetail;
          }),
        );
        const currentPage = +page;
        const totalPage = Math.ceil(total / 10);
        return SuccessResponse({ order, count: total, currentPage, totalPage });
      }
      return NotFoundResponse('Order not found');
    } catch (error) {
      console.error(error);
      return ApiInternalServerErrorResponse();
    }
  }

  async findOne(id: number) {
    const order = await this.orderRepository.findOneBy({ id: id });
    if (order) {
      const orderDetail = await this.orderDetailRepository.find({
        where: {
          order: order,
        } as FindOptionsWhere<Order>,
      });
      await Promise.all(
        orderDetail.map(async (iterator) => {
          const product = await this.productRepository.findBy({
            id: iterator.productId,
          });
          iterator.product = product;
        }),
      );
      order.orderDetail = orderDetail;
      return SuccessResponse(order);
    }
    return NotFoundResponse('Order not found');
  }

  getStatusEnum() {
    try {
      if (StatusOrder == null) {
        return NotFoundResponse('Status not found');
      }
      return SuccessResponse(StatusOrder);
    } catch (error) {}
  }

  async getProfileOrder(currentUser: User) {
    try {
      const order = await this.orderRepository.find({
        where: {
          user: Equal(currentUser.id),
        },
      });
      if (order && order.length > 0) {
        await Promise.all(
          order.map(async (item) => {
            const orderDetail = await this.orderDetailRepository.find({
              where: {
                order: order,
              } as FindOptionsWhere<Order>,
            });
            await Promise.all(
              orderDetail.map(async (iterator) => {
                const product = await this.productRepository.findBy({
                  id: iterator.productId,
                });
                iterator.product = product;
              }),
            );
            item.orderDetail = orderDetail;
          }),
        );

        return SuccessResponse(order);
      }
      return NotFoundResponse('Order not found');
    } catch (error) {
      console.log(error);
      return InternalServerErrorReponse();
    }
  }
}
