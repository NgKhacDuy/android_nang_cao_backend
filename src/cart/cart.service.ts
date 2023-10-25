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
        var listCartDetail = [];
        newCart.user = userExist;
        for (let i in createCartDto.listProduct) {
          const cartDetail = new CartDetail();
          const productExist = await this.productRepository.findOneBy({
            id: createCartDto.listProduct[i].productId,
          });
          if (!productExist) {
            return NotFoundResponse('Product not found');
          }
          cartDetail.money = createCartDto.listProduct[i].money;
          cartDetail.product = productExist;
          cartDetail.productId = createCartDto.listProduct[i].productId;
          cartDetail.quantity = createCartDto.listProduct[i].quantity;
          await this.cartDetailRepository.save(cartDetail);
          listCartDetail.push(cartDetail);
        }
        newCart.cartDetail = listCartDetail;
        newCart.totalMoney = createCartDto.totalMoney;
        newCart.userId = currentUser.id;
        await this.cartRepository.save(newCart);
        return SuccessResponse();
      } else {
        console.log('cart exists');
      }
    } catch (error) {
      console.log(error);
      return BadRequestResponse();
    }
  }

  findAll() {
    return `This action returns all cart`;
  }

  findOne(id: number) {
    return `This action returns a #${id} cart`;
  }

  update(id: number, updateCartDto: UpdateCartDto) {
    return `This action updates a #${id} cart`;
  }

  remove(id: number) {
    return `This action removes a #${id} cart`;
  }
}
