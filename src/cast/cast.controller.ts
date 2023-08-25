import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CastService } from './cast.service';
import { CreateCastDto } from './dto/create-cast.dto';
import { UpdateCastDto } from './dto/update-cast.dto';

@Controller('cast')
export class CastController {
  constructor(private readonly castService: CastService) {}

  @Post()
  create(@Body() createCastDto: CreateCastDto) {
    return this.castService.create(createCastDto);
  }

  @Get()
  findAll() {
    return this.castService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.castService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCastDto: UpdateCastDto) {
    return this.castService.update(+id, updateCastDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.castService.remove(+id);
  }
}
