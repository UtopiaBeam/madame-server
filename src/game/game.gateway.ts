import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Room } from '../decorators/room.decorator';
import {
  BuyChannelMessage,
  PlaceCardMessage,
  UnplaceCardMessage,
} from './game.dto';
import { GameService } from './game.service';

@WebSocketGateway()
export class GameGateway {
  @WebSocketServer() private readonly server: Server;

  constructor(private readonly service: GameService) {}

  @SubscribeMessage('game:start')
  start(@Room() room: string) {
    return this.service.start(room);
  }

  @SubscribeMessage('game:place-card')
  placeCard(
    @ConnectedSocket() client: Socket,
    @MessageBody() msg: PlaceCardMessage,
    @Room() room: string,
  ) {
    const gameState = this.service.getGameState(room);
    const playerState = gameState.findPlayer(client.id);
    playerState.addChannelCard(msg.channel, msg.cardId, msg.isReal);
  }

  @SubscribeMessage('game:unplace-card')
  unplaceCard(
    @ConnectedSocket() client: Socket,
    @MessageBody() msg: UnplaceCardMessage,
    @Room() room: string,
  ) {
    const gameState = this.service.getGameState(room);
    const playerState = gameState.findPlayer(client.id);
    playerState.removeChannelCard(msg.channel);
  }

  @SubscribeMessage('game:buy-channel')
  buyChannel(
    @ConnectedSocket() client: Socket,
    @MessageBody() msg: BuyChannelMessage,
    @Room() room: string,
  ) {
    const gameState = this.service.getGameState(room);
    const playerState = gameState.findPlayer(client.id);
    playerState.buyChannel(msg.channel);
  }

  @SubscribeMessage('game:submit')
  submit(@ConnectedSocket() client: Socket, @Room() room?: string) {
    const allReady = this.service.markPlayerReady(room, client.id);
    if (allReady) {
      const gameStates = this.service.battle(room);
      this.server.emit('game:result', gameStates);
      this.service.prepareNextTurn(gameStates[gameStates.length - 1]);
    }
  }
}
