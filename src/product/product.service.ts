import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Category } from 'src/category/entities/category.entity';
import { Like, Not, Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import {
  NotFoundResponse,
  SuccessResponse,
} from 'src/constants/reponse.constants';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    const categoryExist = await this.categoryRepository.findOneBy({
      id: createProductDto.categoryId,
    });
    if (!categoryExist) return NotFoundResponse();
    const product = this.productRepository.create(createProductDto);
    product.category = categoryExist;
    await this.productRepository.save(product);
    return SuccessResponse();
  }

  async findAll() {
    try {
      const product = await this.productRepository.find({});
      if (!product || product.length === 0) {
        return NotFoundResponse();
      }
      return SuccessResponse(product);
    } catch (error) {
      return error.message;
    }
  }

  async findOne(id: number) {
    const product = await this.productRepository.findOneBy({ id });
    if (product == null) {
      return NotFoundResponse();
    }
    return SuccessResponse(product);
  }

  async findName(name: string) {
    const product = await this.productRepository.find({
      where: {
        name: Like(`%${name}%`),
      },
    });
    if (product == null || product.length === 0) {
      return NotFoundResponse();
    }
    return SuccessResponse(product);
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const productExist = await this.productRepository.findOneBy({ id });
    const categoryExist = await this.categoryRepository.findOneBy({
      id: updateProductDto.categoryId,
    });
    if (productExist !== null && categoryExist !== null) {
      const product = this.productRepository.create(updateProductDto);
      product.category = categoryExist;
      await this.productRepository.update(id, product);
      return SuccessResponse();
    }
    return NotFoundResponse();
  }
}
