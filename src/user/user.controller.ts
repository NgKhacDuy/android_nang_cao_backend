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
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { UserResetPasswordDto } from './dto/user-resetPass.dto';

@ApiTags('user')
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

  @UseGuards(AuthenGuard, AuthorizeGuard([Role.ADMIN]))
  @Get('all/:page')
  async findAll(@Param('page') page: number) {
    return this.userService.findAll(page);
  }

  @UseGuards(AuthenGuard, AuthorizeGuard([Role.ADMIN]))
  @Get('find/:name')
  findName(@Param('name') name: string) {
    return this.userService.findName(name);
  }

  @UseGuards(AuthenGuard, AuthorizeGuard([Role.USER]))
  @Patch(':id')
  update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.updateUser(id, updateUserDto);
  }

  @UseGuards(AuthenGuard, AuthorizeGuard([Role.USER]))
  @Patch('password/:id')
  changePassword(@Param('id') id: number, @Body() password: UserChangePassDto) {
    return this.userService.changePassword(id, password);
  }

  @UseGuards(AuthenGuard)
  @Get('profile')
  getProfile(@CurrentUser() currentUser: User) {
    return currentUser;
  }

  @Post('refresh')
  async refreshToken(@Body() refreshToken: UserRefreshDto) {
    return await this.userService.refreshToken(refreshToken);
  }

  @Post('password/:email')
  resetPassword(@Body() resetPassword: UserResetPasswordDto) {
    return this.userService.resetPassword(resetPassword);
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.userService.delete(id);
  }

  @Get('role')
  getRole() {
    return this.userService.getAllRoles();
  }

  @Post('/admin/employee')
  @ApiQuery({ name: 'role', enum: Role })
  createEmployee(
    @Query('role') role: Role = Role.NVBANHANG,
    @Body() body: UserSignUpDto,
  ) {
    return this.userService.createEmployee(body, role);
  }

  @Patch('admin/employee/role/:id')
  @ApiQuery({ name: 'role', enum: Role })
  patchRoleAdmin(
    @Param('id') id: number,
    @Query('role') role: Role = Role.NVBANHANG,
    @Body() body: UpdateUserDto,
  ) {
    return this.userService.updateRoleAdmin(id, role, body);
  }

  @Post('resetPassword')
  resetPasswordToken(
    @CurrentUser() currentUser: User,
    @Body() password: UserChangePassDto,
  ) {
    return this.userService.resetPasswordViaToken(currentUser, password);
  }
}
