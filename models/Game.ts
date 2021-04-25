import { PlayerStore } from '../stores/PlayerStore';
import { CardData } from '../utils/CardData';
import { RandomGenerator } from '../utils/RandomGenerator';
import { Timer } from '../utils/Timer';
import { GameSetting } from './GameSetting';
import { Player } from './Player';

export class Game {
  public round = 0;

  private _players: Player[] = [];
  private _timer = new Timer();
  private _playerPeople: Record<string, number> = {};

  constructor(
    public readonly id: string,
    creatorId: string,
    private _setting = new GameSetting(),
  ) {
    this.id = RandomGenerator.uuid();
    const creator = PlayerStore.findOne(creatorId);
    this.addPlayer(creator);
  }

  public getStateForPlayer(playerId: string) {
    const player = this.findPlayer(playerId);
    return {
      id: this.id,
      round: this.round,
      ...player,
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
      player.gold = this._setting.startGold;
      for (let i = 0; i < this._setting.startNumberOfCards; i++) {
        const cardType = RandomGenerator.integer(0, CardData.totalTypes);
        player.cards.push(CardData.getCard(cardType));
      }
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
