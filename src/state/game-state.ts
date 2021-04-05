import { PlayerState } from './player-state';

export class GameState {
  turn = 1;
  players: PlayerState[];
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

  addTurn() {
    this.turn++;
  }
}
