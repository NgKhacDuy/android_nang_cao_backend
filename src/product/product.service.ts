import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Category } from 'src/category/entities/category.entity';
import { ILike, Like, Not, Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import {
  BadRequestResponse,
  NotFoundResponse,
  SuccessResponse,
} from 'src/constants/reponse.constants';
import axios from 'axios';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto, file: any) {
    const categoryExist = await this.categoryRepository.findOneBy({
      id: createProductDto.categoryId,
    });
    if (!categoryExist) return NotFoundResponse();
    const product = this.productRepository.create(createProductDto);
    product.category = categoryExist;
    product.color = eval(createProductDto.color[0]);
    var successResponse;
    let listUrl = [];
    var auth = Buffer.from(process.env.PRIVATE_KEY + ':' + '').toString(
      'base64',
    );
    const headersRequest = {
      'Content-Type': 'multipart/form-data;',
      Authorization: `Basic ${auth}`,
    };
    for (let i in file) {
      let data = new FormData();
      data.append('file', file[i].buffer.toString('base64'));
      data.append('fileName', file[i].originalname);
      await axios
        .request({
          method: 'POST',
          maxBodyLength: Infinity,
          url: process.env.URL_UPLOAD,
          headers: headersRequest,
          data: data,
        })
        .then((response) => {
          successResponse = response.data['url'];
          listUrl.push(successResponse);
        })
        .catch((error) => {
          console.log(error);
        });
    }
    product.img = listUrl;
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

  async findAllAdmin(page: number) {
    try {
      if (page <= 0) {
        return BadRequestResponse('Page must be greater than zero');
      }
      const [product, total] = await this.productRepository.findAndCount({
        take: 10,
        skip: page - 1 || 0,
      });
      if (product && product.length > 0) {
        return SuccessResponse({ product, count: total });
      }
      return NotFoundResponse();
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
        name: ILike(`%${name}%`),
      },
    });
    if (product == null || product.length === 0) {
      return NotFoundResponse();
    }
    return SuccessResponse(product);
  }

  async findSlug(slug: string) {
    const product = await this.productRepository.findOneBy({
      slug: slug,
    });
    if (product == null) {
      return NotFoundResponse();
    }
    return SuccessResponse(product);
  }

  async update(
    id: number,
    updateProductDto: UpdateProductDto,
    file: any,
    isChangeImg: boolean,
  ) {
    const productExist = await this.productRepository.findOneBy({ id });
    const categoryExist = await this.categoryRepository.findOneBy({
      id: updateProductDto.categoryId,
    });
    if (productExist !== null && categoryExist !== null) {
      const product = this.productRepository.create(updateProductDto);
      product.category = categoryExist;
      if (isChangeImg === true) {
        var successResponse;
        let listUrl = [];
        var auth = Buffer.from(process.env.PRIVATE_KEY + ':' + '').toString(
          'base64',
        );
        const headersRequest = {
          'Content-Type': 'multipart/form-data;',
          Authorization: `Basic ${auth}`,
        };
        for (let i in file) {
          let data = new FormData();
          data.append('file', file[i].buffer.toString('base64'));
          data.append('fileName', file[i].originalname);
          await axios
            .request({
              method: 'POST',
              maxBodyLength: Infinity,
              url: process.env.URL_UPLOAD,
              headers: headersRequest,
              data: data,
            })
            .then((response) => {
              successResponse = response.data['url'];
              listUrl.push(successResponse);
            })
            .catch((error) => {
              console.log(error);
            });
        }
        product.img = listUrl;
      }
      product.color = eval(updateProductDto.color[0]);
      await this.productRepository.update(id, product);
      return SuccessResponse();
    }
    return NotFoundResponse();
  }

  async updateProductId(id: number, file: any) {
    try {
      const product = await this.productRepository.findOneBy({ id });
      if (!product) {
        return NotFoundResponse('Product not found');
      }
      var successResponse;
      let listUrl = [];
      var auth = Buffer.from(process.env.PRIVATE_KEY + ':' + '').toString(
        'base64',
      );
      const headersRequest = {
        'Content-Type': 'multipart/form-data;',
        Authorization: `Basic ${auth}`,
      };
      for (let i in file) {
        let data = new FormData();
        data.append('file', file[i].buffer.toString('base64'));
        data.append('fileName', file[i].originalname);
        await axios
          .request({
            method: 'POST',
            maxBodyLength: Infinity,
            url: process.env.URL_UPLOAD,
            headers: headersRequest,
            data: data,
          })
          .then((response) => {
            successResponse = response.data['url'];
            listUrl.push(successResponse);
          })
          .catch((error) => {
            console.log(error);
          });
      }
      product.img = listUrl;
      await this.productRepository.save(product);
      return SuccessResponse();
    } catch (error) {
      console.log(error);
      return BadRequestResponse();
    }
  }
  async deleteProductId(id: number) {
    try {
      const product = await this.productRepository.findOneBy({ id: id });
      if (product) {
        await this.productRepository.softDelete({ id: id });
      } else {
        return NotFoundResponse('Product not found');
      }
      return SuccessResponse();
    } catch (error) {
      console.log(error);
      return BadRequestResponse();
    }
  }
}
