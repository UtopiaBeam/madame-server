import { PlayerState } from './player-state';

export class GameState {
  turn = 1;
  players: PlayerState[] = [];
  neutral = 1000;

  addPlayer(name: string, avatar: string) {
    if (this.players.length >= 2) {
      throw new Error('Room is full');
    }

    const player = new PlayerState(name, avatar);
    this.players.push(player);
  }

  findPlayer(name: string) {
    return this.players.find(player => name === player.name);
  }

  findOpponent(name: string) {
    return this.players.find(player => player.name !== name);
  }

  addTurn() {
    this.turn++;
  }

  deletePlayer(name: string) {
    const idx = this.players.findIndex(player => player.name === name);
    this.players.slice(idx, 1);
  }
}
