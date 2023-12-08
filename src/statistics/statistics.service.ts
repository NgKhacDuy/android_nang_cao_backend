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
import {
  InternalServerErrorReponse,
  SuccessResponse,
} from 'src/constants/reponse.constants';
import { Role } from 'src/utilities/common/user-role.enum';
import { response } from 'express';
import { ApiInternalServerErrorResponse } from '@nestjs/swagger';
import * as moment from 'moment';

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

  async getTop10Product() {
    try {
      const result = await dataSource.query(
        `select product.id, 
                product.name, 
                product.color, 
                product.description, 
                product.img, 
                product.money, 
                SUM(CAST("order_detail"."money" as INTEGER)) as SUM 
            from "order_detail" 
            inner join "product" 
            on "order_detail"."productId" = product.id 
            group by product.id 
            order by SUM DESC
            LIMIT 10
            `,
      );
      return SuccessResponse(result);
    } catch (error) {
      console.log(error);
      return InternalServerErrorReponse();
    }
  }

  async getRevenueByMonth() {
    try {
      const months = Array.from({ length: 12 }, (_, i) => i + 1);

      const revenueByMonth = await Promise.all(
        months.map(async (month) => {
          const revenue = await this.orderRepository
            .createQueryBuilder('order')
            .select('SUM(CAST(order.totalMoney as INTEGER))', 'revenue')
            .where('EXTRACT(MONTH FROM order.dateCreate) = :month', { month })
            .getRawOne();

          return { month, revenue: revenue.revenue };
        }),
      );

      return SuccessResponse(revenueByMonth);
    } catch (error) {
      console.log(error);
      return InternalServerErrorReponse();
    }
  }

  async getRevenueByWeek() {
    try {
      const startOfWeek = moment().isoWeekday(1).toDate();
      const endOfWeek = moment().isoWeekday(7).toDate();

      const days = [];
      for (
        let d = new Date(startOfWeek);
        d <= endOfWeek;
        d.setDate(d.getDate() + 1)
      ) {
        days.push(new Date(d));
      }
      const revenueByDay = await Promise.all(
        days.map(async (day) => {
          const revenue = await this.orderRepository
            .createQueryBuilder('order')
            .select('SUM(CAST(order.totalMoney as INTEGER))', 'revenue')
            .where('EXTRACT(DAY FROM order.dateCreate) = :day', {
              day: day.getDate(),
            })
            .andWhere('EXTRACT(MONTH FROM order.dateCreate) = :month', {
              month: day.getMonth() + 1,
            })
            .andWhere('EXTRACT(YEAR FROM order.dateCreate) = :year', {
              year: day.getFullYear(),
            })
            .getRawOne();

          return { day, revenue: revenue.revenue };
        }),
      );

      return SuccessResponse(revenueByDay);
    } catch (error) {
      console.log(error);
      return InternalServerErrorReponse();
    }
  }
}
