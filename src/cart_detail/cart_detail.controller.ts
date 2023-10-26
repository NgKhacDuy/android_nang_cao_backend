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
import { CartDetailService } from './cart_detail.service';
import { UpdateCartDetailDto } from './dto/update-cart_detail.dto';
import { ApiTags } from '@nestjs/swagger';
import { User } from 'src/user/entities/user.entity';
import { CurrentUser } from 'src/utilities/decorators/current-user.decorators';
import { Role } from 'src/utilities/common/user-role.enum';
import { AuthenGuard } from 'src/utilities/guards/authentication.guard';
import { AuthorizeGuard } from 'src/utilities/guards/authorization.guard';
import { UpdateQuantityCartDto } from './dto/update-quantity-cart.dto';

@ApiTags('cart-detail')
@Controller('cart-detail')
export class CartDetailController {
  constructor(private readonly cartDetailService: CartDetailService) {}

  @UseGuards(AuthenGuard, AuthorizeGuard([Role.USER]))
  @Patch('quantity/:quantity')
  update(
    @CurrentUser() currentUser: User,
    @Body() updateQuantityCartDto: UpdateQuantityCartDto,
  ) {
    return this.cartDetailService.update(currentUser, updateQuantityCartDto);
  }

  @UseGuards(AuthenGuard, AuthorizeGuard([Role.USER]))
  @Delete(':productId')
  remove(
    @CurrentUser() currentUser: User,
    @Param('productId') productId: number,
  ) {
    return this.cartDetailService.remove(currentUser, productId);
  }
}
