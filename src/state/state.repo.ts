import { GameState } from './game-state';

export class StateRepository {
  private states: { [roomId: string]: GameState };

  getGameState(roomId: string): GameState | undefined {
    return this.states[roomId];
  }

  deleteGameState(roomId: string) {
    delete this.states[roomId];
  }
}
