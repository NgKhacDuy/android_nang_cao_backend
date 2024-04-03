import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ImagekitService } from './imagekit.service';
import { CreateImagekitDto } from './dto/create-imagekit.dto';
import { UpdateImagekitDto } from './dto/update-imagekit.dto';

@Controller('imagekit')
export class ImagekitController {
  constructor(private readonly imagekitService: ImagekitService) {}

  // @Post()
  // create(@Body() createImagekitDto: CreateImagekitDto) {
  //   return this.imagekitService.upload(createImagekitDto);
  // }
}
