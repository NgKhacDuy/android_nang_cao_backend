import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { Friend } from 'src/friend/entities/friend.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Friend]),
    JwtModule.register({ secret: process.env.ACCESS_TOKEN_SECRET_KEY }),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
