import { PlayerStore } from '../stores/PlayerStore';
import { EffectType } from '../utils/CardData';
import { ChannelData } from '../utils/ChannelData';
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

  private getNeutralPeople(people?: Record<string, number>): number {
    return (
      this._setting.totalPeople -
      Object.values(people ?? this._playersPeople).reduce(
        (acc, p) => acc + p,
        0,
      )
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

  public everyPlayersReady(): boolean {
    return this.players.every(p => p.isReady);
  }

  public resetPlayersReady() {
    this.players.forEach(p => {
      p.isReady = false;
    });
  }

  public battle() {
    const playerPeople = { ...this._playersPeople };
    const peopleStates: Record<string, number>[] = [];

    for (const channel of ChannelData.channels) {
      const affectedPeople = this.players.map(player => {
        const opponent = this.getOpponent(player.id);
        const card = player.channelSlots[channel.order].info;
        // Limit maximum percentage to 50%
        const factor = Math.min(
          0.5,
          channel.audio * card.audioFactor +
            channel.visual * card.visualFactor +
            channel.text * card.textFactor,
        );

        return Math.floor(
          factor *
            (card.effectType === EffectType.PR
              ? this.getNeutralPeople(playerPeople)
              : playerPeople[opponent.id]),
        );
      });

      this.players.forEach((player, idx) => {
        const opponent = this.getOpponent(player.id);
        const card = player.channelSlots[channel.order].info;
        if (card.effectType === EffectType.PR) {
          playerPeople[player.id] += affectedPeople[idx];
        } else {
          playerPeople[opponent.id] -= affectedPeople[idx];
        }
      });

      peopleStates.push(playerPeople);
    }

    return peopleStates;
  }
}
