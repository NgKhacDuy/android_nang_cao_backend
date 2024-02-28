import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class AppService {
  @Cron('0 10 * * * *	')
  refreshServer() {
    console.log('refresh server');
  }
}
