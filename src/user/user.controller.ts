import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserSignUpDto } from './dto/user-signup.dto';
import { UserSignInDto } from './dto/user-signin.dto';
import { UserChangePassDto } from './dto/user-changePass.dto';
import { CurrentUser } from 'src/utilities/decorators/current-user.decorators';
import { User } from './entities/user.entity';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  async signup(@Body() body: UserSignUpDto) {
    return await this.userService.signup(body);
  }

  @Post('signin')
  async signin(@Body() body: UserSignInDto) {
    return await this.userService.signin(body);
  }

  @Get('all')
  async findAll() {
    return this.userService.findAll();
  }

  @Get('find/:name')
  findName(@Param('name') name: string) {
    return this.userService.findName(name);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.updateUser(id, updateUserDto);
  }

  @Patch('password/:id')
  changePassword(@Param('id') id: number, @Body() password: UserChangePassDto) {
    return this.userService.changePassword(id, password);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }

  @Get('profile')
  getProfile(@CurrentUser() currentUser: User) {
    return currentUser;
  }
}
