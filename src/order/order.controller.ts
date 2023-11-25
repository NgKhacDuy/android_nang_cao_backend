import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/utilities/decorators/current-user.decorators';
import { User } from 'src/user/entities/user.entity';
import { StatusOrder } from 'src/utilities/common/status-order.enum';
import { UpdateStatusOrderDto } from './dto/update-status-order.dto';

@ApiTags('order')
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  create(@CurrentUser() currentUser: User, @Body() dto: CreateOrderDto) {
    return this.orderService.create(currentUser, dto);
  }

  @ApiQuery({ name: 'status', enum: StatusOrder })
  @Patch('status/:id')
  updateStatus(
    @Param('id') id: number,
    @Body() updateStatusOrderDto: UpdateStatusOrderDto,
    @Query('status') status: StatusOrder = StatusOrder.WAITING_FOR_ACCEPT,
  ) {
    return this.orderService.updateStatus(
      id,
      status,
      updateStatusOrderDto.reasons,
    );
  }

  @Get('all/:page')
  findAll(@Param('page') page: number) {
    return this.orderService.findAll(page);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orderService.findOne(+id);
  }
}
