import { CardData } from '../utils/CardData';
import { ChannelData } from '../utils/ChannelData';
import { RandomGenerator } from '../utils/RandomGenerator';
import { Card } from './Card';
import { Channel } from './Channel';
import { GameSetting } from './GameSetting';

export class Player {
  public readonly id: string;
  public cards: Card[] = [];
  public availableChannels: Channel[];
  public unavailableChannels: Channel[];
  public channelSlots: Record<number, Card> = {};
  public isReady: boolean = false;

  private _gold: number = 500;

  constructor(public readonly name: string, public readonly avatar: string) {
    this.id = RandomGenerator.uuid();
  }

  get gold(): number {
    return this._gold;
  }

  set gold(newGold: number) {
    if (newGold < 0) {
      throw new Error('Gold cannot be negative');
    }
    this._gold = newGold;
  }

  get info() {
    return {
      id: this.id,
      gold: this._gold,
      cards: this.cards,
      availableChannels: this.availableChannels,
      unavailableChannels: this.unavailableChannels,
    };
  }

  public startGame(gameSetting: GameSetting) {
    this.gold = gameSetting.startGold;
    for (let i = 0; i < gameSetting.startNumberOfCards; i++) {
      const cardType = RandomGenerator.integer(0, CardData.totalTypes);
      this.cards.push(new Card(cardType));
    }
    this.availableChannels = ChannelData.freeChannels.map(
      c => new Channel(c.order),
    );
    this.unavailableChannels = ChannelData.paidChannels.map(
      c => new Channel(c.order),
    );
  }

  public nextRound(gameSetting: GameSetting) {
    this.channelSlots = {};
    this._gold += gameSetting.roundGold;
  }

  public buyChannel(channelId: string) {
    const idx = this.unavailableChannels.findIndex(ac => ac.id === channelId);
    if (idx < 0) {
      throw new Error('Channel bought');
    }
    const channel = this.unavailableChannels[idx];
    if (channel.info.price > this._gold) {
      throw new Error('Not enough gold');
    }
    this.availableChannels.push(channel);
    this.availableChannels.sort((c1, c2) => c1.info.order - c2.info.order);
    this.unavailableChannels.splice(idx, 1);
    this._gold -= channel.info.price;
  }

  public placeCardToChannel(
    channelType: number,
    cardId: string,
    isReal: boolean,
  ) {
    const idx = this.cards.findIndex(c => c.id === cardId);
    if (idx < 0) {
      throw new Error('Card is not in your hand');
    }
    if (this.channelSlots[channelType]) {
      this.cards.push(this.channelSlots[channelType]);
    }
    const card = this.cards.splice(idx, 1)[0];
    card.isReal = isReal;
    this.channelSlots[channelType] = card;
  }

  public unplaceCardFromChannel(channelType: number) {
    if (!this.channelSlots[channelType]) {
      throw new Error('No card in this channel');
    }
    const card = this.channelSlots[channelType];
    this.channelSlots[channelType] = undefined;
    card.isReal = true;
    this.cards.push(card);
  }
}
