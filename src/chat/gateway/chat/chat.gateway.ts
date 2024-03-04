import { UnauthorizedException } from '@nestjs/common';
import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Room } from 'src/chat/entities/room.entity';
import { RoomService } from 'src/chat/service/room.service';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { CurrentUser } from 'src/utilities/decorators/current-user.decorators';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private userService: UserService,
    private roomService: RoomService,
  ) {}
  @WebSocketServer() server: Server;
  handleDisconnect(socket: Socket) {
    socket.disconnect();
  }

  async handleConnection(socket: Socket) {
    try {
      const decodeToken = await this.userService.verifyJwt(
        socket.handshake.headers.authorization,
      );
      const userResponse = await this.userService.findId(decodeToken.id);
      const user = userResponse['data'];
      if (!user) {
        return this.disconnect(socket);
      } else {
        console.log(user);
        socket.data.user = user;
        // const rooms = await this.roomService.getRoomForUser(user.id, {
        //   page: 1,
        //   limit: 10,
        // });
        // return this.server.to(socket.id).emit('rooms', rooms);
      }
    } catch (error) {
      if (error.message == 'jwt expired') {
        this.server.to(socket.id).emit('unauthorized');
      }
      return this.disconnect(socket);
    }
  }

  private disconnect(socket: Socket) {
    socket.emit('Error', new UnauthorizedException());
    socket.disconnect();
  }

  @SubscribeMessage('createRoom')
  async onCreateRoom(socket: Socket, room: Room) {
    // return this.roomService.createRoom(room, socket.data.user);
  }

  @SubscribeMessage('message')
  async handleMessage(@MessageBody() message: string, socket: Socket) {
    console.log(message);
    this.server.emit('message', message);
  }
}
