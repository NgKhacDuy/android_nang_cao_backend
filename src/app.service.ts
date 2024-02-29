import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import axios from 'axios';

@Injectable()
export class AppService {
  @Cron(CronExpression.EVERY_10_MINUTES)
  async refreshServer() {
    const request = await axios.get(
      'https://android-nang-cao-backend.onrender.com/api/v1/status',
    );
    if (request.status !== 200) {
      console.log('Cron job failed');
    } else {
    }
  }
}
