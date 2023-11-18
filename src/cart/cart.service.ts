import { Injectable } from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { Cart } from './entities/cart.entity';
import { CartDetail } from 'src/cart_detail/entities/cart_detail.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import {
  BadRequestResponse,
  NotFoundResponse,
  SuccessResponse,
} from 'src/constants/reponse.constants';
import { Product } from 'src/product/entities/product.entity';
import { UpdateQuantityCartDto } from '../cart_detail/dto/update-quantity-cart.dto';

@Injectable()
export class CartService {
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
  async create(currentUser: User, createCartDto: CreateCartDto) {
    try {
      const userExist = await this.userRepository.findOneBy({
        id: currentUser.id,
      });
      if (!userExist) {
        return NotFoundResponse('User not found');
      }
      const cartExist = await this.cartRepository.findOneBy({
        userId: currentUser.id,
      });
      if (!cartExist) {
        const newCart = new Cart();
        const cartDetail = new CartDetail();
        let listDetail = [];
        newCart.user = userExist;
        const productExist = await this.productRepository.findOneBy({
          id: createCartDto.product.productId,
        });
        if (!productExist) {
          return NotFoundResponse('Product not found');
        }
        // cartDetail.money = createCartDto.product.money;
        cartDetail.product = [];
        cartDetail.product.push(productExist);
        cartDetail.productId = createCartDto.product.productId;
        cartDetail.quantity = createCartDto.product.quantity;
        await this.cartDetailRepository.save(cartDetail);
        listDetail.push(cartDetail);
        newCart.cartDetail = listDetail;
        // newCart.totalMoney = createCartDto.totalMoney;
        newCart.userId = currentUser.id;
        await this.cartRepository.save(newCart);
        return SuccessResponse();
      } else {
        const cartDetail = new CartDetail();
        const productExist = await this.productRepository.findOneBy({
          id: createCartDto.product.productId,
        });
        if (!productExist) {
          return NotFoundResponse('Product not found');
        }
        const existCartDetailTemp = await this.cartDetailRepository.findBy({
          cart: { id: cartExist.id },
        });
        // const existCartDetail = cartExist.cartDetail.find(
        //   (productExist) =>
        //     productExist.productId === createCartDto.product.productId,
        // );
        const existCartDetail = existCartDetailTemp.find(
          (productExist) =>
            productExist.productId === createCartDto.product.productId,
        );
        if (existCartDetail) {
          existCartDetail.quantity = createCartDto.product.quantity;
          await this.cartDetailRepository.update(existCartDetail.id, {
            quantity: existCartDetail.quantity,
          });
        } else {
          // cartDetail.money = createCartDto.product.money;
          cartDetail.product = [];
          cartDetail.product.push(productExist);
          cartDetail.productId = createCartDto.product.productId;
          cartDetail.quantity = createCartDto.product.quantity;
          await this.cartDetailRepository.save(cartDetail);
          cartExist.cartDetail = [];
          existCartDetailTemp.push(cartDetail);
          for (let i in existCartDetailTemp) {
            cartExist.cartDetail.push(existCartDetailTemp[i]);
          }

          console.log(cartExist);

          await this.cartRepository.save(cartExist);
        }
        return SuccessResponse();
      }
    } catch (error) {
      console.log(error);
      return BadRequestResponse();
    }
  }

  async findAll(currentUser: User) {
    try {
      const cartExist = await this.cartRepository.findOneBy({
        userId: currentUser.id,
      });
      if (!cartExist) {
        return NotFoundResponse('Cart not found');
      }
      const cartDetail = await this.cartDetailRepository
        .createQueryBuilder('cart_detail')
        .where('cart_detail.cartId=:cartId', { cartId: cartExist.id })
        .getMany();
      await Promise.all(
        cartDetail.map(async (element) => {
          const product = await this.productRepository.findBy({
            id: element.productId,
          });
          if (product) {
            console.log(element.product);
            element.product = product;
          }
        }),
      );
      cartExist.cartDetail = cartDetail;

      return SuccessResponse(cartExist);
    } catch (error) {}
  }
}
