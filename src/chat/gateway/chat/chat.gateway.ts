import { UnauthorizedException } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UserService } from 'src/user/user.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private userService: UserService) {}
  @WebSocketServer() server: Server;
  handleDisconnect(socket: Socket) {
    socket.disconnect();
  }

  async handleConnection(socket: Socket) {
    try {
      const decodeToken = await this.userService.verifyJwt(
        socket.handshake.headers.authorization,
      );
      const user = await this.userService.findId(decodeToken.id);
      if (!user) {
        return this.disconnect(socket);
      }
    } catch (error) {
      console.log(error);
      return this.disconnect(socket);
    }
  }
  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    return 'Hello world!';
  }

  private disconnect(socket: Socket) {
    socket.emit('Error', new UnauthorizedException());
    socket.disconnect();
  }
}

