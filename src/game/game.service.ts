import { Inject, Injectable } from '@nestjs/common';
import { StateRepository } from '../game/state.repo';
import { GameState } from '../util/game-state';
import { Player } from '../util/player';

@Injectable()
export class GameService {
  constructor(
    @Inject('StateRepository') private readonly repo: StateRepository,
  ) {}

  getRoomGameState(roomId: string): GameState {
    return this.repo.getGameState(roomId);
  }

  createRoom(roomId: string, player: Player) {
    this.repo.createGameState(roomId, player);
  }

  joinRoom(roomId: string, player: Player) {
    const gameState = this.getRoomGameState(roomId);
    gameState.addPlayer(player);
  }
}
