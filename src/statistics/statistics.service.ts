import { Injectable } from '@nestjs/common';
import { CreateStatisticDto } from './dto/create-statistic.dto';
import { UpdateStatisticDto } from './dto/update-statistic.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from 'src/order/entities/order.entity';
import { Product } from 'src/product/entities/product.entity';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { OrderDetail } from 'src/order_detail/entities/order_detail.entity';
import { getManager } from 'typeorm';
import dataSource from 'db/data-source';
import { SuccessResponse } from 'src/constants/reponse.constants';
import { Role } from 'src/utilities/common/user-role.enum';
import { response } from 'express';

@Injectable()
export class StatisticsService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(OrderDetail)
    private orderDetailRepository: Repository<OrderDetail>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async getTop5Customer() {
    try {
      const result = await this.orderRepository
        .createQueryBuilder('order')
        .select('users')
        .addSelect('COUNT(order.id)', 'orderCount')
        .addSelect('SUM(CAST (order.totalMoney AS INTEGER))')
        .innerJoin('order.user', 'users')
        .groupBy('users.id, users')
        .orderBy('SUM(CAST (order.totalMoney AS INTEGER))', 'DESC')
        .take(5)
        .getRawMany();

      const reponse = result.map((item) => {
        const user = new User();
        user.id = item.users_id;
        user.username = item.users_username;
        user.email = item.users_email;
        user.gender = item.users_gender;
        user.lastName = item.users_lastName;
        user.firstName = item.users_firstName;
        user.roles = item.users_roles;
        user.createAt = item.users_createAt;
        user.updateAt = item.users_updateAt;
        user.phoneNumber = item.users_phoneNumber;
        user.deletedAt = item.users_deletedAt;
        return { user: user, orderCount: item.orderCount, sum: item.sum };
      });
      return SuccessResponse(reponse);
    } catch (error) {
      console.log(error.message);
    }
  }

  async getTop5Employee() {
    try {
      const result = await dataSource.manager.query(
        `SELECT 
          users.id,
          users."firstName",
          users."lastName",
          SUM(CAST("order"."totalMoney" AS INTEGER)),
          COUNT("order"."id") 
        FROM 
            users 
        INNER JOIN 
            "order" ON CAST("order"."nvId" AS INTEGER) = users.id 
        WHERE 
            "order"."nvId" <> '' 
        GROUP BY 
            users.id, users."firstName", users."lastName" 
        ORDER BY 
            SUM(CAST("order"."totalMoney" AS INTEGER)) DESC 
        LIMIT 5;
       `,
      );
      return SuccessResponse(result);
    } catch (error) {
      console.log(error);
    }
  }

  getTop10Product() {
    return `This action upd`;
  }

  remove(id: number) {
    return `This action removes a #${id} statistic`;
  }
}
