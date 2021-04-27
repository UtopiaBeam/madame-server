import { Player } from '../models/Player';

export class PlayerStore {
  public static players: Player[] = [];

  public static findOne(playerId: string): Player {
    return this.players.find(p => p.id === playerId);
  }

  public static add(player: Player) {
    this.players.push(player);
  }

  public static remove(playerId: string) {
    const idx = this.players.findIndex(p => p.id === playerId);
    this.players.splice(idx, 1);
  }
}
