import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { RateService } from './rate.service';
import { CreateRateDto } from './dto/create-rate.dto';
import { UpdateRateDto } from './dto/update-rate.dto';
import { ApiTags } from '@nestjs/swagger';
import { User } from 'src/user/entities/user.entity';
import { CurrentUser } from 'src/utilities/decorators/current-user.decorators';
import { Role } from 'src/utilities/common/user-role.enum';
import { AuthenGuard } from 'src/utilities/guards/authentication.guard';
import { AuthorizeGuard } from 'src/utilities/guards/authorization.guard';

@ApiTags('rate')
@Controller('rate')
export class RateController {
  constructor(private readonly rateService: RateService) {}

  @UseGuards(AuthenGuard, AuthorizeGuard([Role.USER]))
  @Post()
  create(
    @CurrentUser() currentUser: User,
    @Body() createRateDto: CreateRateDto,
  ) {
    return this.rateService.create(currentUser, createRateDto);
  }

  @Get()
  findAll() {
    return this.rateService.findAll();
  }

  @Get(':productId')
  findOne(@Param('productId') id: string) {
    return this.rateService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRateDto: UpdateRateDto) {
    return this.rateService.update(+id, updateRateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rateService.remove(+id);
  }
}
