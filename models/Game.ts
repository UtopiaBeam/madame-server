import { PlayerStore } from '../stores/PlayerStore';
import { CardData } from '../utils/CardData';
import { ChannelData } from '../utils/ChannelData';
import { RandomGenerator } from '../utils/RandomGenerator';
import { Timer } from '../utils/Timer';
import { Card } from './Card';
import { Channel } from './Channel';
import { GameSetting } from './GameSetting';
import { Player } from './Player';

export class Game {
  public id: string;
  public round = 0;

  private _players: Player[] = [];
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
    return this._players.find(p => p.id !== playerId);
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
    if (this._players.length >= 2) {
      throw new Error('Room is full');
    }
    this._players.push(player);
  }

  public findPlayer(playerId: string): Player {
    return this._players.find(p => p.id === playerId);
  }

  public start() {
    this._timer.reset();
    this.round = 1;
    this._players.forEach(player => {
      this._playersPeople[player.id] = this._setting.startPeople;
      player.gold = this._setting.startGold;
      for (let i = 0; i < this._setting.startNumberOfCards; i++) {
        const cardType = RandomGenerator.integer(0, CardData.totalTypes);
        player.cards.push(new Card(cardType));
      }
      player.availableChannels = ChannelData.freeChannels.map(
        c => new Channel(c.order),
      );
      player.unavailableChannels = ChannelData.paidChannels.map(
        c => new Channel(c.order),
      );
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
