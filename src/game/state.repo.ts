import { GameState } from '../util/game-state';
import { Player } from '../util/player';

export class StateRepository {
  private states: Record<string, GameState> = {};

  getGameState(roomId: string): GameState | undefined {
    return this.states[roomId];
  }

  createGameState(roomId: string, player: Player) {
    this.states[roomId] = new GameState();
    this.states[roomId].addPlayer(player);
  }

  deleteGameState(roomId: string) {
    delete this.states[roomId];
  }
}
