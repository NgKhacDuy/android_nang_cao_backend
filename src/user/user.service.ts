import {
  Injectable,
  InternalServerErrorException,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { ILike, Like, Not, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserSignUpDto } from './dto/user-signup.dto';
import {
  BadRequestResponse,
  InternalServerErrorReponse,
  NotFoundResponse,
  SigninResponse,
  SuccessResponse,
} from 'src/constants/reponse.constants';
import { compare, hash } from 'bcrypt';
import { UserSignInDto } from './dto/user-signin.dto';
import { sign, verify } from 'jsonwebtoken';
import { UserChangePassDto } from './dto/user-changePass.dto';
import { UserRefreshDto } from './dto/user-refresh.dto';
import { ApiTags } from '@nestjs/swagger';
import { UserResetPasswordDto } from './dto/user-resetPass.dto';
import { Role } from 'src/utilities/common/user-role.enum';
import { Response } from 'express';
import { UserSearchDto } from './dto/user-search.dto';
import { JwtService } from '@nestjs/jwt';
import { Friend } from 'src/friend/entities/friend.entity';
import { stat } from 'fs';
import { Room } from 'src/chat/entities/room.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Friend) private friendRepository: Repository<Friend>,
    @InjectRepository(Room) private roomRepository: Repository<Room>,
    private readonly jwtService: JwtService,
  ) {}

  async signup(body: UserSignUpDto, res: Response) {
    try {
      const userExist = await this.userRepository.findOneBy({
        phoneNumber: body.phoneNumber,
      });
      if (userExist)
        return res.status(400).send(BadRequestResponse('User already exists'));
      body.password = await hash(body.password, 10);
      const user = this.userRepository.create(body);
      await this.userRepository.save(user);
      return res.status(200).send(SuccessResponse());
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async signin(body: UserSignInDto, res: Response) {
    const userExists = await this.userRepository
      .createQueryBuilder('users')
      .addSelect('users.password')
      .where('users.phoneNumber=:phoneNumber', {
        phoneNumber: body.phoneNumber,
      })
      .getOne();

    if (!userExists)
      return res
        .status(404)
        .send(NotFoundResponse('Tài khoản không đúng hoặc không tồn tại'));

    const matchPassword = await compare(body.password, userExists.password);
    if (!matchPassword)
      return res
        .status(400)
        .send(BadRequestResponse('Tài khoản không đúng hoặc không tồn tại'));
    userExists.appId = body.appId;
    await this.userRepository.save(userExists);
    delete userExists.password;
    return res
      .status(200)
      .send(
        SuccessResponse(
          SigninResponse(
            await this.accessToken(userExists),
            await this.generateRefreshToken(userExists),
          ),
        ),
      );
  }

  async signout(currentUser: User, res: Response) {
    try {
      currentUser.appId = '';
      await this.userRepository.save(currentUser);
      return res.status(200).send(SuccessResponse());
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto, res: Response) {
    const user = await this.userRepository.findOneBy({ id });
    if (user !== null) {
      await this.userRepository.update(id, updateUserDto);
      return res.status(200).send(SuccessResponse());
    }
    return res.status(404).send(NotFoundResponse());
  }

  async changePassword(id: string, password: UserChangePassDto) {
    const user = await this.userRepository.findOneBy({ id });
    if (user !== null) {
      password.password = await hash(password.password, 10);
      await this.userRepository.update(id, password);
      return SuccessResponse();
    }
    return NotFoundResponse();
  }

  async accessToken(user: User) {
    return sign(
      {
        id: user.id,
        name: user.name,
        phoneNumber: user.phoneNumber,
      },
      process.env.ACCESS_TOKEN_SECRET_KEY,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRE_TIME },
    );
  }

  async generateRefreshToken(user: User) {
    return sign(
      {
        id: user.id,
        name: user.name,
        phoneNumber: user.phoneNumber,
      },
      process.env.REFRESH_TOKEN_SECRET_KEY,
      { expiresIn: process.env.REFRESH_TOKEN_EXPIRE_TIME },
    );
  }

  async refreshToken(refreshToken: UserRefreshDto, res: Response) {
    try {
      const { id } = <JwtPayload>(
        verify(refreshToken.refreshToken, process.env.REFRESH_TOKEN_SECRET_KEY)
      );
      const user = await this.userRepository.findOneBy({ id: id });
      if (!user) {
        throw new UnauthorizedException();
      }
      const accessToken = await this.accessToken(user);
      return res
        .status(200)
        .send(
          SuccessResponse(
            SigninResponse(accessToken, refreshToken.refreshToken),
          ),
        );
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException();
    }
  }

  async findId(id: string) {
    const user = await this.userRepository.findOneBy({ id });
    if (user === null) {
      return NotFoundResponse();
    }
    return SuccessResponse(user);
  }

  async findUser(keyword: string, res: Response, currentUser: User) {
    var user = await this.userRepository.find({
      where: [
        { name: ILike(`%${keyword}%`), id: Not(currentUser.id) },
        { phoneNumber: ILike(`%${keyword}%`), id: Not(currentUser.id) },
      ],
    });
    var room = await this.roomRepository.find({
      where: [{ name: ILike(`%${keyword}%`), isGroup: true }],
    });
    await Promise.all(
      user.map(async (item) => {
        item.friends = [];
        const friend = await this.friendRepository.find({
          where: [
            { idSender: currentUser.id, idReceiver: item.id },
            { idSender: item.id, idReceiver: currentUser.id },
          ],
        });
        if (friend) {
          item.friends = friend;
        }
      }),
    );
    return res.status(200).send(SuccessResponse({ user: user, room: room }));
  }

  verifyJwt(jwt: string): Promise<any> {
    return this.jwtService.verifyAsync(jwt);
  }
}
interface JwtPayload {
  id: string;
}
