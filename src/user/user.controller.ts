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
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserSignUpDto } from './dto/user-signup.dto';
import { UserSignInDto } from './dto/user-signin.dto';

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

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get('all')
  async findAll() {
    return this.userService.findAll();
  }
  
  @Get(':name')
  findName(@Param('name') name: string) {
    return this.userService.findName(name);
  }

  @Get(':id')
  findId(@Param('id') id: number) {
    return this.userService.findId(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
