import { Player } from './player';
import { PlayerState } from './player-state';

export class GameState {
  turn = 1;
  playerStates: PlayerState[] = [];
  neutral = 999;

  addPlayer(player: Player) {
    if (this.playerStates.length >= 2) {
      throw new Error('Room is full');
    }

    const playerState = new PlayerState(player);
    this.playerStates.push(playerState);
  }

  findPlayer(id: string) {
    return this.playerStates.find(p => p.id === id);
  }

  findOpponent(id: string) {
    return this.playerStates.find(p => p.id !== id);
  }

  deletePlayer(id: string) {
    const idx = this.playerStates.findIndex(p => p.id === id);
    this.playerStates.slice(idx, 1);
  }

  getGameStateForPlayer(id: string) {
    const playerState = this.findPlayer(id);
    return { turn: this.turn, neutral: this.neutral, playerState };
  }
}
