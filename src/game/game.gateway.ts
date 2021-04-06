import {
  ConnectedSocket,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { Room } from '../decorators/room.decorator';
import { GameService } from './game.service';

@WebSocketGateway()
export class GameGateway {
  constructor(private readonly service: GameService) {}

  @SubscribeMessage('game:buy-card')
  buyCard(@ConnectedSocket() client: Socket, @Room() room?: string) {}

  @SubscribeMessage('game:submit')
  submit(@ConnectedSocket() client: Socket, @Room() room?: string) {}
}
