import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { CreateStatisticDto } from './dto/create-statistic.dto';
import { UpdateStatisticDto } from './dto/update-statistic.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('statistics')
@Controller('statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Get('/top-5-customer')
  findTop5Customer() {
    return this.statisticsService.getTop5Customer();
  }

  @Get('/top-5-employee')
  findTop5Employee() {
    return this.statisticsService.getTop5Employee();
  }

  @Get('/top-10-product')
  findTop10Product() {
    return this.statisticsService.getTop10Product();
  }
}
