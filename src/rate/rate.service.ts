import { Injectable } from '@nestjs/common';
import { CreateRateDto } from './dto/create-rate.dto';
import { UpdateRateDto } from './dto/update-rate.dto';
import { User } from 'src/user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/product/entities/product.entity';
import { Equal, FindManyOptions, FindOptionsWhere, Repository } from 'typeorm';
import { Rate } from './entities/rate.entity';
import {
  BadRequestResponse,
  NotFoundResponse,
  SuccessResponse,
} from 'src/constants/reponse.constants';

@Injectable()
export class RateService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Rate)
    private rateRepository: Repository<Rate>, // @InjectRepository(User)
  ) // private userRepository: Repository<User>,
  {}
  async create(currentUser: User, createRateDto: CreateRateDto) {
    try {
      const product = await this.productRepository.findOneBy({
        id: createRateDto.productId,
      });
      if (product) {
        const rate = this.rateRepository.create(createRateDto);
        rate.comment = createRateDto.comment;
        rate.rate = createRateDto.rate;
        rate.products = [product];
        rate.users = [currentUser];
        await this.rateRepository.save(rate);
        return SuccessResponse();
      } else {
        return NotFoundResponse('Product not found');
      }
    } catch (error) {
      console.log(error);
    }
  }

  findAll() {
    return `This action returns all rate`;
  }

  async findOne(id: number) {
    try {
      const products = await this.productRepository.findOneBy({ id: id });
      if (products) {
        const rate = await this.rateRepository.findOne({
          where: {
            products: {
              id: products.id,
            },
          },
          relations: ['users'],
        });
        if (rate) {
          return SuccessResponse(rate);
        } else {
          return NotFoundResponse('rate not found');
        }
      } else {
        return NotFoundResponse('Product not found');
      }
    } catch (error) {
      console.log(error);
      return BadRequestResponse();
    }
  }

  update(id: number, updateRateDto: UpdateRateDto) {
    return `This action updates a #${id} rate`;
  }

  remove(id: number) {
    return `This action removes a #${id} rate`;
  }
}
