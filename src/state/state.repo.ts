import { GameState } from './game-state';

export class StateRepository {
  private states: Record<string, GameState> = {};

  getGameState(roomId: string): GameState | undefined {
    return this.states[roomId];
  }

  createGameState(roomId: string, name: string, avatar: string) {
    this.states[roomId] = new GameState();
    this.states[roomId].addPlayer(name, avatar);
  }

  deleteGameState(roomId: string) {
    delete this.states[roomId];
  }
}
