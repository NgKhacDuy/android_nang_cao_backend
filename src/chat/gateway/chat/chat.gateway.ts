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
import { CreateMessageDto } from 'src/message/dto/create-message.dto';
import { MessageService } from 'src/message/message.service';
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
    private messageService: MessageService,
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
      const user: User = userResponse['data'];
      if (!user) {
        return this.disconnect(socket);
      } else {
        socket.data.user = user;
        const rooms = await this.roomService.getRoomForUser(user.id);
        return this.server.to(socket.id).emit('rooms', rooms);
      }
    } catch (error) {
      console.log(error);
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
  async handleMessage(
    @MessageBody() message: CreateMessageDto,
    socket: Socket,
  ) {
    this.server.emit('message', this.messageService.create(message));
  }
}
