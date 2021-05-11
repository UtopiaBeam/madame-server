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
import { SpecialEvent } from '../data/SpecialEventData';
import { PlaySpecialActionBody } from '../types';

export class Game {
  public id: string;
  public round = 0;
  public players: Player[] = [];
  public event: SpecialEvent;

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
      specialEvent: this.event,
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
      specialEvent: this.event,
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
      throw new Error('ห้องเต็ม');
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

  public startRound() {
    this._timer.reset();
    this._timer.start(this.setting.roundTime);
  }

  public startSpecialAction() {
    this._timer.reset();
    this.resetPlayersReady();
    this._exposedCards = this.players.reduce(
      (acc, p) => ({ ...acc, [p.id]: [] }),
      {},
    );
    this._timer.start(this.setting.specialActionTime);
  }

  public nextRound() {
    if (this.round === this.setting.numberOfRound) {
      this.end();
    } else {
      this.round++;
      if (this.round === this.setting.eventRound) {
        this.event = RandomGenerator.event();
      } else {
        this.event = undefined;
      }
      this.players.forEach(p => {
        p.channelSlots = {};
        p.gold += this._playersPeople[p.id];
        p.usedActionType = undefined;
      });
      this._affectedPeople = {};
      this._exposedCards = {};
      this.resetPlayersReady();
    }
  }

  public dealCards() {
    const cards = [];
    for (let i = 0; i < this.setting.roundDealCards; i++) {
      const cardType = RandomGenerator.cardType(this.round);
      const card = new Card(cardType);
      cards.push(card.info);
    }

    return cards;
  }

  public selectCards(playerId: string, cardTypes: number[]) {
    if (cardTypes.length !== this.setting.roundSelectCards) {
      throw new Error('จำนวนการที่เลือกไม่ถูกต้อง');
    }
    const player = this.findPlayer(playerId);
    const cards = cardTypes.map(ct => new Card(ct));
    player.cards.push(...cards);
  }

  public end() {
    const summary = Object.entries(this._playersPeople);
    const winnerId =
      summary[0][1] > summary[1][1]
        ? summary[0][0]
        : summary[0][1] < summary[1][1]
        ? summary[1][0]
        : null;
    this.emit('end-game', {
      winner: winnerId ? this.findPlayer(winnerId) : null,
      neutral: this.getNeutralPeople(),
      ...this._playersPeople,
    });

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
        const card = player.channelSlots[channel.type]?.info;
        if (!card) {
          return 0;
        }
        // Limit maximum percentage to 50%
        const factor = Math.min(
          0.5,
          (channel.audio *
            card.audioFactor *
            (this.event?.cardEffect?.audio ?? 1) +
            channel.visual *
              card.visualFactor *
              (this.event?.cardEffect?.visual ?? 1) +
            channel.text *
              card.textFactor *
              (this.event?.cardEffect?.text ?? 1) +
            channel.baseFactor) *
            (this.event?.channelEffect?.[channel.type] ?? 1),
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
        const card = player.channelSlots[channel.type]?.info;
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

    const playerCards = this.players.reduce(
      (acc, p) => ({ ...acc, [p.id]: p.info.channelSlots }),
      {},
    );
    return { ...playerCards, peopleStates };
  }

  public handleSpecialAction({
    actionType,
    playerId,
    cardId,
  }: PlaySpecialActionBody) {
    const action = SpecialActionData.getSpecialAction(actionType);
    const player = this.findPlayer(playerId);

    if (player.usedActionType && player.usedActionType !== actionType) {
      throw new Error('ไม่สามารถทำการกระทำพิเศษอื่นได้');
    }
    if (player.usedActionType === 2) {
      throw new Error('สามารถสอดส่องได้ตาละครั้งเท่านั้น');
    }
    if (action.cost > player.gold) {
      throw new Error('เงินไม่พอ');
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

  public getSpecialActionResult() {
    return this.players.reduce(
      (acc, player) => ({
        ...acc,
        [player.id]: {
          exposedCards: this._exposedCards[player.id],
          people: this._playersPeople[player.id],
        },
      }),
      { neutral: this.getNeutralPeople() },
    );
  }
}
