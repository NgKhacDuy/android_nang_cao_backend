import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/utilities/decorators/current-user.decorators';
import { User } from 'src/user/entities/user.entity';
import { StatusOrder } from 'src/utilities/common/status-order.enum';
import { UpdateStatusOrderDto } from './dto/update-status-order.dto';
import { Role } from 'src/utilities/common/user-role.enum';
import { AuthenGuard } from 'src/utilities/guards/authentication.guard';
import { AuthorizeGuard } from 'src/utilities/guards/authorization.guard';

@ApiTags('order')
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  create(@CurrentUser() currentUser: User, @Body() dto: CreateOrderDto) {
    return this.orderService.create(currentUser, dto);
  }

  @UseGuards(AuthenGuard, AuthorizeGuard([Role.ADMIN]))
  @ApiQuery({ name: 'status', enum: StatusOrder })
  @Patch('status/:id')
  updateStatus(
    @Param('id') id: number,
    @Body() updateStatusOrderDto: UpdateStatusOrderDto,
    @CurrentUser() currentUser: User,
    @Query('status') status: StatusOrder = StatusOrder.WAITING_FOR_ACCEPT,
  ) {
    return this.orderService.updateStatus(
      id,
      status,
      updateStatusOrderDto.reasons,
      currentUser,
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
