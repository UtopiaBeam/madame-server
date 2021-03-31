import {
  ConnectedSocket,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { RoomService } from './room.service';

@WebSocketGateway(9000, { transports: ['websocket'] })
export class RoomGateway {
  @WebSocketServer() private readonly server: Server;

  constructor(private readonly service: RoomService) {}

  handleConnection(@ConnectedSocket() client: Socket) {
    this.server.to(client.id).emit('connected');
  }

  @SubscribeMessage('createRoom')
  async createRoom(@ConnectedSocket() client: Socket) {
    let roomId = this.service.getCurrentRoom(client);
    if (!roomId) {
      throw new Error('Already joined a room');
    }
    roomId = this.service.randomRoomId();
    client.join(roomId);
    this.server.to(roomId).emit('joinedRoom', { roomId });
  }
}
