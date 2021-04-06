import { Injectable } from '@nestjs/common';
import { GameState } from '../util/game-state';
import { Player } from '../util/player';

@Injectable()
export class GameService {
  private states: Record<string, GameState> = {};

  getGameState(roomId: string): GameState {
    return this.states[roomId];
  }

  createGameState(roomId: string, player: Player) {
    this.states[roomId] = new GameState();
    this.states[roomId].addPlayer(player);
  }

  deleteGameState(roomId: string) {
    delete this.states[roomId];
  }

  joinRoom(roomId: string, player: Player) {
    const gameState = this.getGameState(roomId);
    gameState.addPlayer(player);
  }

  markPlayerReady(roomId: string, playerId: string) {
    const gameState = this.getGameState;
  }
}
