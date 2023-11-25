import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  Delete,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import {
  AnyFilesInterceptor,
  FileInterceptor,
  FilesInterceptor,
} from '@nestjs/platform-express';
import { HttpService } from '@nestjs/axios';
import * as fs from 'fs';
import { map } from 'rxjs';
import axios from 'axios';
import { response } from 'express';
import {
  BadRequestResponse,
  SuccessResponse,
} from 'src/constants/reponse.constants';
import { request } from 'http';

@ApiTags('product')
@Controller('product')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly httpService: HttpService,
  ) {}

  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  @Get()
  findAll() {
    return this.productService.findAll();
  }

  @Get('admin/:page')
  findAllAdmin(@Param('page') page: number) {
    return this.productService.findAllAdmin(page);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(+id, updateProductDto);
  }

  @Get('name/:name')
  findName(@Param('name') name: string) {
    return this.productService.findName(name);
  }

  @Get('slug/:slug')
  findSlug(@Param('slug') slug: string) {
    return this.productService.findSlug(slug);
  }

  @Post('image/:id')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(AnyFilesInterceptor())
  uploadImage(@Param('id') id: number, @UploadedFiles() file) {
    return this.productService.updateProductId(id, file);
  }

  @Delete(':id')
  deleteProductId(@Param('id') id: number) {
    return this.productService.deleteProductId(id);
  }
}
