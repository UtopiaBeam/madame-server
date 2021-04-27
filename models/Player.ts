import { CardData } from '../data/CardData';
import { ChannelData } from '../data/ChannelData';
import { SpecialAction, SpecialActionData } from '../data/SpecialActionData';
import { RandomGenerator } from '../utils/RandomGenerator';
import { Card } from './Card';
import { Channel } from './Channel';
import { GameSetting } from './GameSetting';

export class Player {
  public readonly id: string;
  public cards: Card[] = [];
  public availableChannels: Channel[] = [];
  public unavailableChannels: Channel[] = [];
  public channelSlots: Record<number, Card> = {};
  public isReady: boolean = false;
  public usedActionType: number;

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
      name: this.name,
      avatar: this.avatar,
      gold: this._gold,
      cards: this.cards.map(c => c.info),
      availableChannels: this.availableChannels.map(c => c.info),
      unavailableChannels: this.unavailableChannels.map(c => c.info),
      channelSlots: Object.entries(this.channelSlots).reduce<
        Record<number, any>
      >(
        (acc, [type, card]) => ({ ...acc, ...(card && { [type]: card.info }) }),
        {},
      ),
    };
  }

  public startGame(gameSetting: GameSetting) {
    this.gold = gameSetting.startGold;
    for (let i = 0; i < gameSetting.startNumberOfCards; i++) {
      const cardType = RandomGenerator.integer(0, CardData.totalTypes);
      this.cards.push(new Card(cardType));
    }
    // TODO: Wait frontend to finish
    // this.availableChannels = ChannelData.freeChannels.map(
    //   c => new Channel(c.channelType),
    // );
    // this.unavailableChannels = ChannelData.paidChannels.map(
    //   c => new Channel(c.channelType),
    // );
    this.availableChannels = ChannelData.channels.map(
      c => new Channel(c.channelType),
    );
  }

  public buyChannels(channelIds: string[]) {
    const indices = channelIds.map(channelId =>
      this.unavailableChannels.findIndex(ac => ac.id === channelId),
    );
    if (indices.some(idx => idx < 0)) {
      throw new Error('Channel bought');
    }
    const totalPrice = indices.reduce(
      (acc, idx) => acc + this.unavailableChannels[idx].info.price,
      0,
    );
    if (totalPrice > this._gold) {
      throw new Error('Not enough gold');
    }
    this._gold -= totalPrice;
    indices.forEach(idx => {
      const channel = this.unavailableChannels[idx];
      this.availableChannels.push(channel);
      this.unavailableChannels.splice(idx, 1);
    });
    this.availableChannels.sort(
      (c1, c2) => c1.info.channelType - c2.info.channelType,
    );
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
