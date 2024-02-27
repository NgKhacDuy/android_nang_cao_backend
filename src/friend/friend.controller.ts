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
  Query,
} from '@nestjs/common';
import { FriendService } from './friend.service';
import { CreateFriendDto } from './dto/create-friend.dto';
import { UpdateFriendDto } from './dto/update-friend.dto';
import { ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { AuthenGuard } from 'src/utilities/guards/authentication.guard';
import { CurrentUser } from 'src/utilities/decorators/current-user.decorators';
import { User } from 'src/user/entities/user.entity';
import { FriendStatusDtoEnum } from 'src/utilities/common/friend-status_dto.enum';
import { UUID } from 'crypto';

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

  @ApiQuery({ name: 'status', enum: FriendStatusDtoEnum })
  @ApiParam({ name: 'id', format: 'uuid', type: 'string' })
  @Patch(':id')
  update(
    @Param('id') id: UUID,
    @Query('status') status: FriendStatusDtoEnum = FriendStatusDtoEnum.ACCEPT,
    @CurrentUser() currentUser: User,
    @Res() res: Response,
  ) {
    return this.friendService.update(id, status, currentUser, res);
  }
}
