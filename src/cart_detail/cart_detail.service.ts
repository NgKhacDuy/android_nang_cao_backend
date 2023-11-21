import { Injectable } from '@nestjs/common';
import { CreateCartDetailDto } from './dto/create-cart_detail.dto';
import { UpdateCartDetailDto } from './dto/update-cart_detail.dto';
import { CartDetail } from './entities/cart_detail.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { UpdateQuantityCartDto } from './dto/update-quantity-cart.dto';
import {
  NotFoundResponse,
  SuccessResponse,
  BadRequestResponse,
} from 'src/constants/reponse.constants';
import { Product } from 'src/product/entities/product.entity';
import { Cart } from 'src/cart/entities/cart.entity';

@Injectable()
export class CartDetailService {
  constructor(
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
    @InjectRepository(CartDetail)
    private cartDetailRepository: Repository<CartDetail>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}
  create(createCartDetailDto: CreateCartDetailDto) {
    return 'This action adds a new cartDetail';
  }

  findAll() {
    return `This action returns all cartDetail`;
  }

  findOne(id: number) {
    return `This action returns a #${id} cartDetail`;
  }

  async update(
    currentUser: User,
    updateQuantityCartDto: UpdateQuantityCartDto,
  ) {
    try {
      const userExist = await this.userRepository.findOneBy({
        id: currentUser.id,
      });
      const cartExist = await this.cartRepository.findOneBy({
        userId: currentUser.id,
      });
      const productExist = await this.productRepository.findOneBy({
        id: updateQuantityCartDto.productId,
      });
      if (!productExist) {
        return NotFoundResponse('Product not found');
      }

      if (!cartExist) {
        return NotFoundResponse('Cart not found');
      }

      if (!userExist) {
        return NotFoundResponse('User not found');
      }

      // const productExistInCart = cartExist.cartDetail.find(
      //   (cart) => cart.productId === updateQuantityCartDto.productId,
      // );
      // if (!productExistInCart) {
      //   return NotFoundResponse('Product not found in cart');
      // }

      // productExistInCart.quantity = updateQuantityCartDto.quantity;
      await this.cartDetailRepository.update(updateQuantityCartDto.id, {
        quantity: updateQuantityCartDto.quantity,
      });

      return SuccessResponse();
    } catch (error) {
      console.log(error);
      return BadRequestResponse();
    }
  }

  async remove(currentUser: User, id: number) {
    try {
      const userExist = await this.userRepository.findOneBy({
        id: currentUser.id,
      });
      const cartExist = await this.cartRepository.findOneBy({
        userId: currentUser.id,
      });

      const cartDetail = await this.cartDetailRepository.findOneBy({
        id: id,
      });

      if (!cartExist) {
        return NotFoundResponse('Cart not found');
      }

      if (!cartDetail) {
        return NotFoundResponse('Cart detail not found');
      }

      if (!userExist) {
        return NotFoundResponse('User not found');
      }

      await this.cartDetailRepository.delete({
        id: id,
      });
      return SuccessResponse();
    } catch (error) {
      console.log(error);
      return BadRequestResponse();
    }
  }
}
