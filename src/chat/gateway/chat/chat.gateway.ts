import { UnauthorizedException } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AddUserToGroup } from 'src/chat/dto/add-user.dto';
import { CreateRoomDto } from 'src/chat/dto/create-room.dto';
import { GetMessageDto } from 'src/chat/dto/get-message.dto';
import { RemoveUserOutGroup } from 'src/chat/dto/remove-user.dto';
import { Room } from 'src/chat/entities/room.entity';
import { RoomService } from 'src/chat/service/room.service';
import { ImagekitService } from 'src/imagekit/imagekit.service';
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
    private imagekitService: ImagekitService,
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

  @SubscribeMessage('message')
  async handleMessage(
    @ConnectedSocket() socket: Socket,
    @MessageBody() message: any,
  ) {
    const temp = JSON.parse(message);
    const dto: CreateMessageDto = temp;
    await this.messageService.create(dto);
    this.server
      .to(dto.roomId)
      .emit(
        'message',
        await this.roomService.sendMessage(dto.roomId, dto.senderId),
      );
  }

  @SubscribeMessage('join_room')
  async handleJoinRoom(
    // @MessageBody() message: CreateMessageDto,
    socket: Socket,
    roomId: string,
  ) {
    this.server.socketsJoin(roomId);
    // this.server.emit('message', this.messageService.create(message));
    this.server.to(roomId).emit('user_joined', { user: socket.id });
    this.server
      .to(roomId)
      .emit('message', await this.roomService.getMessageForRoom(roomId));
  }

  @SubscribeMessage('create_room')
  async handleCreateRoom(socket: Socket, @MessageBody() room: any) {
    const convert = JSON.parse(room);
    const dto: CreateRoomDto = convert;
    await this.roomService.createRoom(dto);
  }

  @SubscribeMessage('image')
  async handleImage(socket: Socket, @MessageBody() message: any) {
    this.imagekitService.upload(message);
  }

  @SubscribeMessage('add_user_to_group')
  async addUserToGroup(socket: Socket, @MessageBody() message: any) {
    const convert = JSON.parse(message);
    const dto: AddUserToGroup = convert;
    this.roomService.addUserToGroup(dto);
  }

  @SubscribeMessage('remove_user')
  async removeUser(socket: Socket, @MessageBody() message: any) {
    const convert = JSON.parse(message);
    const dto: RemoveUserOutGroup = convert;
    this.roomService.removeUser(dto);
  }
}
