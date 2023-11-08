import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { ILike, Like, Repository } from 'typeorm';
import {
  BadRequestResponse,
  NotFoundResponse,
  SuccessResponse,
} from 'src/constants/reponse.constants';
import { Product } from 'src/product/entities/product.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}
  async create(createCategoryDto: CreateCategoryDto) {
    try {
      const categoryExist = await this.categoryRepository.findOneBy({
        name: createCategoryDto.name,
      });
      if (categoryExist) return BadRequestResponse();
      const category = this.categoryRepository.create(createCategoryDto);
      await this.categoryRepository.save(category);
      return SuccessResponse();
    } catch (error) {
      return BadRequestResponse();
    }
  }

  async findAll() {
    try {
      const category = await this.categoryRepository.find({});
      if (!category || category.length === 0) {
        return NotFoundResponse();
      }
      return SuccessResponse(category);
    } catch (error) {
      return error.message;
    }
  }

  async findOne(id: number) {
    const category = await this.categoryRepository.findOneBy({ id });
    if (category == null) {
      return NotFoundResponse();
    }
    return SuccessResponse(category);
  }

  async findName(name: string) {
    const category = await this.categoryRepository.find({
      where: {
        name: ILike(`%${name}%`),
      },
    });
    if (category == null || category.length === 0) {
      return NotFoundResponse();
    }
    return SuccessResponse(category);
  }

  async findSlug(slug: string) {
    const category = await this.categoryRepository.findOneBy({ slug: slug });
    if (category == null) {
      return NotFoundResponse();
    }
    const product = await this.productRepository
      .createQueryBuilder('product')
      .where('product.categoryId=:categoryId', { categoryId: category.id })
      .getMany();
    category.product = product;
    return SuccessResponse(category);
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.categoryRepository.findOneBy({ id });
    if (category !== null) {
      await this.categoryRepository.update(id, updateCategoryDto);
      return SuccessResponse();
    }
    return NotFoundResponse();
  }
}
