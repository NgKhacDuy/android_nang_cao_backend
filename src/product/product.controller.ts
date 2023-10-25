import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { HttpService } from '@nestjs/axios';
import * as fs from 'fs';
import { map } from 'rxjs';
import axios from 'axios';
import { response } from 'express';
import { SuccessResponse } from 'src/constants/reponse.constants';
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

  @Post('image')
  @UseInterceptors(FileInterceptor('file', {}))
  uploadImage(@UploadedFile() file) {
    try {
      let data = new FormData();
      var successResponse;
      var auth = Buffer.from(process.env.PRIVATE_KEY + ':' + '').toString(
        'base64',
      );
      const headersRequest = {
        'Content-Type': 'multipart/form-data;', // afaik this one is not needed
        Authorization: `Basic ${auth}`,
      };
      data.append('file', file.buffer.toString('base64'));
      data.append('fileName', file.originalname);
      axios
        .request({
          method: 'POST',
          maxBodyLength: Infinity,
          url: process.env.URL_UPLOAD,
          headers: headersRequest,
          data: data,
        })
        .then((response) => {
          console.log(response.data['url']);
          successResponse = response.data['url'];
        })
        .catch((error) => {
          console.log(error);
        });
      return SuccessResponse(successResponse);
    } catch (error) {
      console.log(error);
    }
  }
}
