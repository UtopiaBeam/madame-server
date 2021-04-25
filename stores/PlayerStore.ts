import { Player } from '../models/Player';

export class PlayerStore {
  private static _players: Player[] = [];

  public static findOne(playerId: string): Player {
    return this._players.find(p => p.id === playerId);
  }

  public static add(player: Player) {
    this._players.push(player);
  }

  public static remove(playerId: string) {
    const idx = this._players.findIndex(p => p.id === playerId);
    this._players.splice(idx, 1);
  }
}
