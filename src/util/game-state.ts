import { Card } from './card';
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

  findPlayerIndex(id: string) {
    return this.playerStates.findIndex(p => p.id === id);
  }

  findOpponent(id: string) {
    return this.playerStates.find(p => p.id !== id);
  }

  deletePlayer(id: string) {
    const idx = this.findPlayerIndex(id);
    this.playerStates.slice(idx, 1);
  }

  getGameStateForPlayer(id: string) {
    const playerState = this.findPlayer(id);
    return { turn: this.turn, neutral: this.neutral, playerState };
  }

  markPlayerReady(id: string): boolean {
    const idx = this.findPlayerIndex(id);
    this.playerStates[idx].ready = true;
    return this.playerStates.every(state => state.ready);
  }

  getChannelCards(): Record<string, Card[]> {
    return this.playerStates.reduce(
      (acc, state) => ({ ...acc, [state.id]: state.channelCards }),
      {},
    );
  }

  prepareNextTurn() {
    this.turn++;
    this.playerStates.forEach(state => state.prepareNextTurn());
  }

  start() {
    this.playerStates.forEach(state => state.start());
  }
}
