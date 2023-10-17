import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Like, Repository } from 'typeorm';
import {
  BadRequestResponse,
  NotFoundResponse,
  SuccessResponse,
} from 'src/constants/reponse.constants';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
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
        name: Like(`%${name}%`),
      },
    });
    if (category == null || category.length === 0) {
      return NotFoundResponse();
    }
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
