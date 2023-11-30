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
  CallHandler,
  ExecutionContext,
  NestInterceptor,
  Type,
  mixin,
  Query,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiBody, ApiConsumes, ApiTags, getSchemaPath } from '@nestjs/swagger';
import {
  AnyFilesInterceptor,
  FileInterceptor,
  FilesInterceptor,
} from '@nestjs/platform-express';
import { HttpService } from '@nestjs/axios';
import * as fs from 'fs';
import { Observable, map } from 'rxjs';
import axios from 'axios';
import { response } from 'express';
import {
  BadRequestResponse,
  SuccessResponse,
} from 'src/constants/reponse.constants';
import { request } from 'http';
import {
  ApiImplicitFormData,
  FileToBodyInterceptor,
} from 'src/utilities/decorators/api-implicit-form-data.decorator';

@ApiTags('product')
@Controller('product')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly httpService: HttpService,
  ) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(AnyFilesInterceptor(), FileToBodyInterceptor)
  create(@Body() body: CreateProductDto, @UploadedFiles() file) {
    console.log(body.benefit);
    console.log(file);
    return this.productService.create(body, file);
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
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(AnyFilesInterceptor(), FileToBodyInterceptor)
  update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @UploadedFiles() file,
  ) {
    return this.productService.update(+id, updateProductDto, file);
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
        ['files']: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
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

export function JsonToObjectsInterceptor(
  fields: string[],
): Type<NestInterceptor> {
  class JsonToObjectsInterceptorClass implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      const request = context.switchToHttp().getRequest();
      console.log(request.body);
      if (request.body) {
        fields.forEach((field) => {
          if (request.body[field]) {
            request.body[field] = JSON.parse(request.body[field]);
            console.log(request.body);
          }
        });
      }
      return next.handle();
    }
  }
  const Interceptor = mixin(JsonToObjectsInterceptorClass);
  return Interceptor as Type<NestInterceptor>;
}
