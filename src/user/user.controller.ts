import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  Res,
  UseInterceptors,
  UploadedFiles,
  UploadedFile,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserSignUpDto } from './dto/user-signup.dto';
import { UserSignInDto } from './dto/user-signin.dto';
import { UserChangePassDto } from './dto/user-changePass.dto';
import { CurrentUser } from 'src/utilities/decorators/current-user.decorators';
import { User } from './entities/user.entity';
import { AuthenGuard } from 'src/utilities/guards/authentication.guard';
import { AuthorizeGuard } from 'src/utilities/guards/authorization.guard';
import { AuthorizeRoles } from 'src/utilities/decorators/authorize-roles.decorator';
import { Role } from 'src/utilities/common/user-role.enum';
import { UserRefreshDto } from './dto/user-refresh.dto';
import { ApiConsumes, ApiQuery, ApiTags } from '@nestjs/swagger';
import { UserResetPasswordDto } from './dto/user-resetPass.dto';
import { Response } from 'express';
import { UserSearchDto } from './dto/user-search.dto';
import { SuccessResponse } from 'src/constants/reponse.constants';
import { FileToBodyInterceptor } from 'src/utilities/decorators/api-implicit-form-data.decorator';
import { AnyFilesInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { UpdateImgDto } from './dto/update-img.dto';
import { UUID } from 'crypto';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  async signup(@Body() body: UserSignUpDto, @Res() res: Response) {
    return await this.userService.signup(body, res);
  }

  @Post('signin')
  async signin(@Body() body: UserSignInDto, @Res() res: Response) {
    return await this.userService.signin(body, res);
  }

  @UseGuards(AuthenGuard)
  @Get('logout')
  async logout(@CurrentUser() currentUser: User, @Res() res: Response) {
    return await this.userService.signout(currentUser, res);
  }

  // @UseGuards(AuthenGuard, AuthorizeGuard([Role.ADMIN]))
  // @Get('all/:page')
  // async findAll(@Param('page') page: number) {
  //   return this.userService.findAll(page);
  // }

  // @UseGuards(AuthenGuard, AuthorizeGuard([Role.ADMIN]))
  // @Get('find/:name')
  // findName(@Param('name') name: string) {
  //   return this.userService.findName(name);
  // }

  @UseGuards(AuthenGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Res() res: Response,
  ) {
    return this.userService.updateUser(id, updateUserDto, res);
  }

  @UseGuards(AuthenGuard)
  @Patch('password/:id')
  changePassword(@Param('id') id: string, @Body() password: UserChangePassDto) {
    return this.userService.changePassword(id, password);
  }

  @UseGuards(AuthenGuard)
  @Get('profile')
  getProfile(@CurrentUser() currentUser: User, @Res() res: Response) {
    return res.status(200).send(SuccessResponse(currentUser));
  }

  @Post('refresh')
  async refreshToken(
    @Body() refreshToken: UserRefreshDto,
    @Res() res: Response,
  ) {
    return await this.userService.refreshToken(refreshToken, res);
  }

  @UseGuards(AuthenGuard)
  @Get('search/:keyword')
  async searchUser(
    @CurrentUser() currentUser: User,
    @Param('keyword') keyword: string,
    @Res() res: Response,
  ) {
    return await this.userService.findUser(keyword, res, currentUser);
  }

  @UseGuards(AuthenGuard)
  @Get('friendrequest')
  async getFriendRequest(
    @CurrentUser() currentUser: User,
    @Res() res: Response,
  ) {
    return await this.userService.getFriendRequest(res, currentUser);
  }

  @Post('image')
  async uploadImg(
    @CurrentUser() currentUser: User,
    @Res() res: Response,
    @Body() body: UpdateImgDto,
  ) {
    return await this.userService.uploadImg(res, currentUser, body);
  }

  @Get('isPhoneNumberExist/:phoneNumber')
  async isPhoneNumberExist(
    @Param('phoneNumber') phoneNumber: string,
    @Res() res: Response,
  ) {
    return await this.userService.getUserIdByPhoneNumber(phoneNumber, res);
  }
  @Patch('resetpassword/:id')
  resetPassword(@Param('id') id: string, @Body() password: UserChangePassDto) {
    return this.userService.changePassword(id, password);
  }

  @Get('generateotp/:phoneNumber')
  async generateOtpForResetPassword(
    @Param('phoneNumber') phoneNumber: string,
    @Res() res: Response,
  ) {
    return await this.userService.generateOTP(phoneNumber, 4, res);
  }

  @UseGuards(AuthenGuard)
  @Get('friend')
  async getUserFriend(@Res() res: Response, @CurrentUser() currentUser: User) {
    return await this.userService.getUserFriend(res, currentUser);
  }

  @UseGuards(AuthenGuard)
  @Get('room/:idUser')
  async getFriendFavorite(
    @Res() res: Response,
    @Param('idUser') id: string,
    @CurrentUser() currentUser: User,
  ) {
    return await this.userService.getRoomFromId(id, res, currentUser);
  }
}
