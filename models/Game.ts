import { io } from '..';
import { GameStore } from '../stores/GameStore';
import { PlayerStore } from '../stores/PlayerStore';
import { EffectType } from '../data/CardData';
import { ChannelData } from '../data/ChannelData';
import { RandomGenerator } from '../utils/RandomGenerator';
import { Timer } from '../utils/Timer';
import { Card } from './Card';
import { GameSetting } from './GameSetting';
import { Player } from './Player';
import { SpecialAction, SpecialActionData } from '../data/SpecialActionData';

export class Game {
  public id: string;
  public round = 0;
  public players: Player[] = [];

  private _timer: Timer;
  private _playersPeople: Record<string, number> = {};
  private _affectedPeople: Record<string, number> = {};
  private _exposedCards: Record<string, Card[]> = {};

  constructor(public setting = new GameSetting()) {
    this.id = RandomGenerator.gameId();
    this._timer = new Timer(this.id);
  }

  public emit(event: string, payload?: unknown) {
    io.to(this.id).emit(event, payload);
  }

  private getNeutralPeople(people?: Record<string, number>): number {
    return (
      this.setting.totalPeople -
      Object.values(people ?? this._playersPeople).reduce(
        (acc, p) => acc + p,
        0,
      )
    );
  }

  private getOpponent(playerId: string): Player {
    return this.players.find(p => p.id !== playerId);
  }

  public get state() {
    return {
      id: this.id,
      round: this.round,
      players: this.players.map(p => p.info),
      neutral: this.getNeutralPeople(),
      playerPeople: this._playersPeople,
    };
  }

  public getStateForPlayer(playerId: string) {
    const player = this.findPlayer(playerId);
    const opponent = this.getOpponent(playerId);
    return {
      id: this.id,
      round: this.round,
      ...player.info,
      ...(opponent && {
        people: this._playersPeople[playerId],
        neutral: this.getNeutralPeople(),
        opponent: this._playersPeople[opponent.id],
      }),
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
      this._playersPeople[player.id] = this.setting.startPeople;
      this._exposedCards[player.id] = [];
      player.startGame(this.setting);
    });
    this._timer.start(this.setting.roundTime);
  }

  public startSpecialAction() {
    this._timer.reset();
    this.resetPlayersReady();
    this._timer.start(this.setting.specialActionTime);
  }

  public nextRound() {
    if (this.round === this.setting.numberOfRound) {
      this.end();
    } else {
      this.round++;
      this.players.forEach(p => {
        p.channelSlots = {};
        p.gold += this._playersPeople[p.id];
        p.usedActionType = undefined;
      });
      this._affectedPeople = {};
      this._exposedCards = {};
      this.emit('next-round');
    }
  }

  public dealCards() {
    const cards = [];
    for (let i = 0; i < this.setting.roundDealCards; i++) {
      const cardType = RandomGenerator.cardType();
      const card = new Card(cardType);
      cards.push(card.info);
    }

    return cards;
  }

  public selectCards(playerId: string, cardTypes: number[]) {
    if (cardTypes.length !== this.setting.roundSelectCards) {
      throw new Error('Invalid number of selected cards');
    }
    const player = this.findPlayer(playerId);
    const cards = cardTypes.map(ct => new Card(ct));
    player.cards.push(...cards);
  }

  private end() {
    const summary = Object.entries(this._playersPeople);
    const winnerId =
      summary[0][1] > summary[1][1] ? summary[0][0] : summary[1][0];
    this.emit('end-game', { winner: this.findPlayer(winnerId) });

    // Clean up
    GameStore.remove(this.id);
    this.players.forEach(p => {
      PlayerStore.remove(p.id);
    });
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
    const playerPeople = this._playersPeople;
    const peopleStates: Record<string, number>[] = [];

    for (const channel of ChannelData.channels) {
      const affectedPeople = this.players.map(player => {
        const opponent = this.getOpponent(player.id);
        const card = player.channelSlots[channel.channelType]?.info;
        if (!card) {
          return 0;
        }
        // Limit maximum percentage to 50%
        const factor = Math.min(
          0.5,
          channel.audio * card.audioFactor +
            channel.visual * card.visualFactor +
            channel.text * card.textFactor +
            channel.baseFactor,
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
        const card = player.channelSlots[channel.channelType]?.info;
        if (!card) {
          return;
        }
        if (card.effectType === EffectType.PR) {
          playerPeople[player.id] += affectedPeople[idx];
          this._affectedPeople[player.id] = affectedPeople[idx];
        } else {
          playerPeople[opponent.id] -= affectedPeople[idx];
          this._affectedPeople[opponent.id] = affectedPeople[idx];
        }
      });

      peopleStates.push({ ...playerPeople });
    }

    this.resetPlayersReady();

    return peopleStates;
  }

  public handleSpecialAction(
    actionType: number,
    playerId: string,
    cardId?: string,
  ) {
    const action = SpecialActionData.getSpecialAction(actionType);
    const player = this.findPlayer(playerId);

    if (player.usedActionType && player.usedActionType !== actionType) {
      throw new Error('Cannot do different action');
    }
    if (player.usedActionType === 2) {
      throw new Error('Can only spy once');
    }
    if (action.cost > player.gold) {
      throw new Error('Not enough money');
    }

    player.gold -= action.cost;
    player.usedActionType = actionType;

    const opponent = this.getOpponent(playerId);
    const card = Object.values(opponent.channelSlots).find(
      c => c.id === cardId,
    );
    switch (action.name) {
      // Investigate a card, if fake cancel the effect
      case SpecialAction.Investigate:
        if (!card.isReal) {
          this._exposedCards[opponent.id].push(card);
          if (card.info.effectType === EffectType.PR) {
            this._playersPeople[opponent.id] -= this._affectedPeople[card.id];
          } else {
            this._playersPeople[player.id] += this._affectedPeople[card.id];
          }
          this._affectedPeople = undefined;
        }
      // Expose a card, if fake apply the change to player
      case SpecialAction.Expose:
        if (!card.isReal) {
          this._exposedCards[opponent.id].push(card);
          this._playersPeople[player.id] += this._affectedPeople[card.id];
          this._playersPeople[opponent.id] -= this._affectedPeople[card.id];
          this._affectedPeople = undefined;
        }
        break;
      // Reveal opponent's cards
      case SpecialAction.Spy:
        this._exposedCards[opponent.id] = opponent.cards;
    }
  }
}
