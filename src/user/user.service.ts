import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserSignUpDto } from './dto/user-signup.dto';
import {
  BadRequestResponse,
  NotFoundResponse,
  SigninResponse,
  SuccessResponse,
} from 'src/constants/reponse.constants';
import { compare, hash } from 'bcrypt';
import { UserSignInDto } from './dto/user-signin.dto';
import { sign, verify } from 'jsonwebtoken';
import { UserChangePassDto } from './dto/user-changePass.dto';
import { UserRefreshDto } from './dto/user-refresh.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async signup(body: UserSignUpDto) {
    try {
      const userExists = await this.findUserByEmail(body.email);
      if (userExists) throw BadRequestResponse;
      body.password = await hash(body.password, 10);
      const user = this.userRepository.create(body);
      await this.userRepository.save(user);
      return SuccessResponse();
    } catch (error) {
      throw BadRequestResponse();
    }
  }

  async signin(body: UserSignInDto) {
    const userExists = await this.userRepository
      .createQueryBuilder('users')
      .addSelect('users.password')
      .where('users.username=:username', { username: body.username })
      .getOne();
    if (!userExists) return BadRequestResponse();
    const matchPassword = await compare(body.password, userExists.password);
    if (!matchPassword) return BadRequestResponse();
    delete userExists.password;
    return SigninResponse(
      await this.accessToken(userExists),
      await this.generateRefreshToken(userExists),
    );
  }

  async findAll() {
    try {
      const users = await this.userRepository.find();
      if (!users || users.length === 0) {
        return NotFoundResponse();
      }
      return SuccessResponse(users);
    } catch (error) {
      return error.message;
    }
  }

  async findId(id: number) {
    const user = await this.userRepository.findOneBy({ id });
    if (user === null) {
      return NotFoundResponse();
    }
    return SuccessResponse(user);
  }

  async findName(name: string) {
    const user = await this.userRepository.findOneBy({ name });
    if (user === null) {
      return NotFoundResponse();
    }
    return SuccessResponse(user);
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOneBy({ id });
    if (user !== null) {
      await this.userRepository.update(id, updateUserDto);
      return SuccessResponse();
    }
    return NotFoundResponse();
  }

  async remove(id: number) {
    const user = await this.userRepository.findOneBy({ id });
    if (user !== null) {
      await this.userRepository.delete(id);
      return SuccessResponse();
    }
    return NotFoundResponse();
  }

  async changePassword(id: number, password: UserChangePassDto) {
    const user = await this.userRepository.findOneBy({ id });
    if (user !== null) {
      password.password = await hash(password.password, 10);
      await this.userRepository.update(id, password);
      return SuccessResponse();
    }
    return NotFoundResponse();
  }

  async findUserByEmail(email: string) {
    return await this.userRepository.findOneBy({ email });
  }

  async accessToken(user: User) {
    return sign(
      { id: user.id, username: user.username },
      process.env.ACCESS_TOKEN_SECRET_KEY,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRE_TIME },
    );
  }

  async generateRefreshToken(user: User) {
    return sign(
      { id: user.id, username: user.username },
      process.env.REFRESH_TOKEN_SECRET_KEY,
      { expiresIn: process.env.REFRESH_TOKEN_EXPIRE_TIME },
    );
  }

  async refreshToken(refreshToken: UserRefreshDto) {
    try {
      const { id } = <JwtPayload>(
        verify(refreshToken.refreshToken, process.env.REFRESH_TOKEN_SECRET_KEY)
      );
      const user = await this.findId(+id);
      if (!user) {
        throw new UnauthorizedException();
      }
      const accessToken = await this.accessToken(user['data']);
      return { accessToken };
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}
interface JwtPayload {
  id: string;
}
