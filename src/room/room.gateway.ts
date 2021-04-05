import {
  ConnectedSocket,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { RoomService } from './room.service';

@WebSocketGateway()
export class RoomGateway {
  constructor(private readonly service: RoomService) {}

  @SubscribeMessage('room:create')
  async createRoom(@ConnectedSocket() client: Socket) {
    let roomId = this.service.getCurrentRoom(client);
    if (roomId) {
      throw new Error('Already joined a room');
    }
    roomId = this.service.randomRoomId();
    client.join(roomId);
    return roomId;
  }
}
