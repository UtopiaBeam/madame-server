import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { Room } from '../decorators/room.decorator';
import { CreateRoomMessage, JoinRoomMessage } from './room.dto';
import { RoomService } from './room.service';

@WebSocketGateway()
export class RoomGateway {
  constructor(private readonly service: RoomService) {}

  @SubscribeMessage('room:create')
  async createRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: CreateRoomMessage,
    @Room() room?: string,
  ) {
    if (room) {
      throw new Error('Already joined a room');
    }
    room = this.service.createRoom({ id: client.id, ...body });
    client.join(room);
    return room;
  }

  @SubscribeMessage('room:join')
  async joinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() { roomId, ...player }: JoinRoomMessage,
    @Room() room?: string,
  ) {
    if (room) {
      throw new Error('Already joined a room');
    }
    this.service.joinRoom(roomId, player);
    client.join(roomId);

    return this.service.getPlayers(roomId);
  }
}
