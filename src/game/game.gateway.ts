import {
  ConnectedSocket,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { Room } from '../decorators/room.decorator';

@WebSocketGateway()
export class GameGateway {
  @SubscribeMessage('game:buy-card')
  buyCard(@ConnectedSocket() client: Socket, @Room() room?: string) {}

  @SubscribeMessage('game:submit')
  submit(@ConnectedSocket() client: Socket, @Room() room?: string) {}
}
