import { Game } from '../models/Game';

export class GameStore {
  private static _games: Game[] = [];

  public static findOne(gameId: string): Game {
    return this._games.find(g => g.id === gameId);
  }

  public static add(game: Game) {
    this._games.push(game);
  }

  public static remove(gameId: string) {
    const idx = this._games.findIndex(g => g.id === gameId);
    this._games.splice(idx, 1);
  }
}
