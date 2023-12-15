import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { sign } from 'jsonwebtoken';
import { NotFoundResponse } from 'src/constants/reponse.constants';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { MailerService } from '@nestjs-modules/mailer';
import { Order } from 'src/order/entities/order.entity';

@Injectable()
export class MailService {
  constructor(
    private mailerService: MailerService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
  ) {}

  async sendPasswordReset(user: User, email: string) {
    const token = sign(
      { id: user.id, username: user.username },
      process.env.ACCESS_TOKEN_SECRET_KEY,
      { expiresIn: '10m' },
    );
    const url = `127.0.0.1:3000/forgot_password?token=${token}`;
    await this.mailerService.sendMail({
      to: email,
      subject: 'Reset password.',
      template: './reset-password',

      context: {
        name: user.firstName + ' ' + user.lastName,
        url: url,
      },
    });
  }

  async sendOrderInfo(user: User, order: Order) {
    const url = `127.0.0.1:3000/order`;
    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Your order.',
      template: './order-detail',
      context: {
        order: order,
      },
    });
  }
}
