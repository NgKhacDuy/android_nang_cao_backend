import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { sign } from 'jsonwebtoken';
import { NotFoundResponse } from 'src/constants/reponse.constants';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(
    private mailerService: MailerService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async sendPasswordReset(user: User, email: string) {
    const token = sign(
      { id: user.id, username: user.username },
      process.env.RESET_PASSWORD_SECRET_KEY,
      { expiresIn: process.env.RESET_PASSWORD_EXPIRE_TIME },
    );
    const url = `127.0.0.1:3000/auth/resetPassword?token=${token}`;
    await this.mailerService.sendMail({
      to: email,
      subject: 'Reset password.',
      template: './reset-password',

      context: {
        name: user.name,
        url: url,
      },
    });
  }
}
