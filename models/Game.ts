import { PlayerStore } from '../stores/PlayerStore';
import { RandomGenerator } from '../utils/RandomGenerator';
import { Timer } from '../utils/Timer';
import { GameSetting } from './GameSetting';
import { Player } from './Player';

export class Game {
  public id: string;
  public round = 0;
  public players: Player[] = [];

  private _timer: Timer;
  private _playersPeople: Record<string, number> = {};

  constructor(creatorId: string, private _setting = new GameSetting()) {
    this.id = RandomGenerator.uuid();
    const creator = PlayerStore.findOne(creatorId);
    this.addPlayer(creator);
  }

  private getNeutralPeople(): number {
    return (
      this._setting.totalPeople -
      Object.values(this._playersPeople).reduce((acc, p) => acc + p, 0)
    );
  }

  private getOpponent(playerId: string): Player {
    return this.players.find(p => p.id !== playerId);
  }

  public getStateForPlayer(playerId: string) {
    const player = this.findPlayer(playerId);
    return {
      id: this.id,
      round: this.round,
      ...player.info,
      people: this._playersPeople[playerId],
      neutral: this.getNeutralPeople(),
      opponent: this._playersPeople[this.getOpponent(playerId).id],
    };
  }

  public addPlayer(player: Player) {
    if (this.players.length >= 2) {
      throw new Error('Room is full');
    }
    this.players.push(player);
  }

  public findPlayer(playerId: string): Player {
    return this.players.find(p => p.id === playerId);
  }

  public start() {
    this._timer.reset();
    this.round = 1;
    this.players.forEach(player => {
      this._playersPeople[player.id] = this._setting.startPeople;
      player.startGame(this._setting);
    });
    this._timer.start(this._setting.roundTime);
  }

  public startSpecialAction() {
    this._timer.reset();
    this._timer.start(this._setting.specialActionTime);
  }

  public nextRound() {
    if (this.round === this._setting.numberOfRound) {
      // TODO: end game
    } else {
      this.round++;
    }
  }
}
