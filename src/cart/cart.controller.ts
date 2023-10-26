import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { ApiTags } from '@nestjs/swagger';
import { Role } from 'src/utilities/common/user-role.enum';
import { AuthenGuard } from 'src/utilities/guards/authentication.guard';
import { AuthorizeGuard } from 'src/utilities/guards/authorization.guard';
import { User } from 'src/user/entities/user.entity';
import { CurrentUser } from 'src/utilities/decorators/current-user.decorators';
import { UpdateQuantityCartDto } from '../cart_detail/dto/update-quantity-cart.dto';

@ApiTags('cart')
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @UseGuards(AuthenGuard, AuthorizeGuard([Role.USER]))
  @Post()
  create(
    @CurrentUser() currentUser: User,
    @Body() createCartDto: CreateCartDto,
  ) {
    return this.cartService.create(currentUser, createCartDto);
  }

  @UseGuards(AuthenGuard, AuthorizeGuard([Role.USER]))
  @Get()
  findAll(@CurrentUser() currentUser: User) {
    return this.cartService.findAll(currentUser);
  }
}
