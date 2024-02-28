import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class AppService {
  @Cron(CronExpression.EVERY_10_MINUTES)
  refreshServer() {
    console.log('refresh server');
  }
}
