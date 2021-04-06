import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { CreateRoomMessage, JoinRoomMessage } from './room.dto';
import { RoomService } from './room.service';

@WebSocketGateway()
export class RoomGateway {
  constructor(private readonly service: RoomService) {}

  @SubscribeMessage('room:create')
  async createRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: CreateRoomMessage,
  ) {
    let roomId = this.service.getCurrentRoom(client);
    if (roomId) {
      throw new Error('Already joined a room');
    }
    roomId = this.service.createRoom(body);
    client.join(roomId);
    return roomId;
  }

  @SubscribeMessage('room:join')
  async joinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: JoinRoomMessage,
  ) {
    const currentRoom = this.service.getCurrentRoom(client);
    if (currentRoom) {
      throw new Error('Already joined a room');
    }
    this.service.joinRoom(body);
    client.join(body.roomId);
  }
}
