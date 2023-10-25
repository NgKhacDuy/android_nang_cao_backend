import { Injectable } from '@nestjs/common';
import { CreateCartDetailDto } from './dto/create-cart_detail.dto';
import { UpdateCartDetailDto } from './dto/update-cart_detail.dto';
import { CartDetail } from './entities/cart_detail.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CartDetailService {
  constructor(
    @InjectRepository(CartDetail)
    private categoryRepository: Repository<CartDetail>,
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

  update(id: number, updateCartDetailDto: UpdateCartDetailDto) {
    return `This action updates a #${id} cartDetail`;
  }

  remove(id: number) {
    return `This action removes a #${id} cartDetail`;
  }
}
