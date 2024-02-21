import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  UseGuards,
} from '@nestjs/common';
import { FriendService } from './friend.service';
import { CreateFriendDto } from './dto/create-friend.dto';
import { UpdateFriendDto } from './dto/update-friend.dto';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { AuthenGuard } from 'src/utilities/guards/authentication.guard';
import { CurrentUser } from 'src/utilities/decorators/current-user.decorators';
import { User } from 'src/user/entities/user.entity';

@ApiTags('friend')
@Controller('friend')
export class FriendController {
  constructor(private readonly friendService: FriendService) {}

  @UseGuards(AuthenGuard)
  @Post()
  create(
    @Body() createFriendDto: CreateFriendDto,
    @Res() res: Response,
    @CurrentUser() currentUser: User,
  ) {
    return this.friendService.create(createFriendDto, res, currentUser);
  }

  @UseGuards(AuthenGuard)
  @Get()
  findAll(@Res() res: Response, @CurrentUser() currentUser: User) {
    return this.friendService.findAll(res, currentUser);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.friendService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFriendDto: UpdateFriendDto) {
    return this.friendService.update(+id, updateFriendDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.friendService.remove(+id);
  }
}
