import { Injectable } from '@nestjs/common';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Supplier } from './entities/supplier.entity';
import { Like, Repository } from 'typeorm';
import {
  BadRequestResponse,
  NotFoundResponse,
  SuccessResponse,
} from 'src/constants/reponse.constants';

@Injectable()
export class SupplierService {
  constructor(
    @InjectRepository(Supplier)
    private supplierRepository: Repository<Supplier>,
  ) {}
  async create(createSupplierDto: CreateSupplierDto) {
    try {
      const supplier = this.supplierRepository.create(createSupplierDto);
      await this.supplierRepository.save(supplier);
      return SuccessResponse();
    } catch (error) {
      return BadRequestResponse();
    }
  }

  async findAll(page: number) {
    try {
      if (page <= 0) {
        return BadRequestResponse('Page must be greater than zero');
      }
      const [supplier, total] = await this.supplierRepository.findAndCount({});
      if (!supplier || supplier.length <= 0) {
        return NotFoundResponse();
      }
      const currentPage = +page || 1;
      const totalPage = Math.ceil(total / 10);
      return SuccessResponse({
        supplier,
        count: total,
        currentPage,
        totalPage,
      });
    } catch (error) {
      console.log(error);
      return BadRequestResponse();
    }
  }

  async findOne(id: number) {
    const supplier = await this.supplierRepository.findOneBy({ id });
    if (supplier === null) {
      return NotFoundResponse();
    }
    return SuccessResponse(supplier);
  }

  async findName(name: string) {
    const supplier = await this.supplierRepository.find({
      where: {
        name: Like(`%${name}%`),
      },
    });
    if (supplier === null || supplier.length === 0) {
      return NotFoundResponse();
    }
    return SuccessResponse(supplier);
  }

  async update(id: number, updateSupplierDto: UpdateSupplierDto) {
    const supplier = await this.supplierRepository.findOneBy({ id });
    if (supplier != null) {
      await this.supplierRepository.update(id, updateSupplierDto);
      return SuccessResponse();
    }
    return NotFoundResponse();
  }

  async delete(id: number) {
    try {
      const supplier = await this.supplierRepository.findOneBy({ id: id });
      if (!supplier) {
        return NotFoundResponse();
      }
      await this.supplierRepository.softDelete({ id: id });
      return SuccessResponse();
    } catch (error) {
      console.log(error);
      return BadRequestResponse();
    }
  }
}
