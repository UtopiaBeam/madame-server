import { Game } from '../models/Game';

export class GameStore {
  public static games: Game[] = [];

  public static findOne(gameId: string): Game {
    return this.games.find(g => g.id === gameId);
  }

  public static add(game: Game) {
    this.games.push(game);
  }

  public static remove(gameId: string) {
    const idx = this.games.findIndex(g => g.id === gameId);
    this.games.splice(idx, 1);
  }
}
