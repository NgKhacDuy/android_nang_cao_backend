import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
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
import { sign } from 'jsonwebtoken';

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
    return SigninResponse(await this.accessToken(userExists), userExists);
  }

  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
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
    const user = await this.userRepository.findOneBy({id});
    if (user === null) {
      return NotFoundResponse();
    }
    return SuccessResponse(user);
  }

  async findName(name: string) {
    const user = await this.userRepository.findOneBy({name});
    if (user === null) {
      return NotFoundResponse();
    }
    return SuccessResponse(user);
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
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
}
