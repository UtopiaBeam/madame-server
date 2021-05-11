import { CardDetail } from '../data/CardData';
import { ChannelData } from '../data/ChannelData';
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
      isReady: this.isReady,
      availableChannels: this.availableChannels.map(c => c.info),
      unavailableChannels: this.unavailableChannels.map(c => c.info),
      channelSlots: Object.entries(this.channelSlots).reduce<{
        [k: number]: CardDetail;
      }>(
        (acc, [type, card]) => ({ ...acc, ...(card && { [type]: card.info }) }),
        {},
      ),
    };
  }

  public startGame(gameSetting: GameSetting) {
    this.gold = gameSetting.startGold;
    for (let i = 0; i < gameSetting.startNumberOfCards; i++) {
      const cardType = RandomGenerator.cardType(1);
      this.cards.push(new Card(cardType));
    }
    this.availableChannels = ChannelData.freeChannels.map(
      c => new Channel(c.type),
    );
    this.unavailableChannels = ChannelData.paidChannels.map(
      c => new Channel(c.type),
    );
  }

  public buyChannels(types: number[]) {
    const indices = types.map(type =>
      this.unavailableChannels.findIndex(c => c.type === type),
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
    types.forEach(type => {
      const idx = this.unavailableChannels.findIndex(c => c.type === type);
      const channel = this.unavailableChannels[idx];
      this.availableChannels.push(channel);
      this.unavailableChannels.splice(idx, 1);
    });
    this.availableChannels.sort((c1, c2) => c1.info.type - c2.info.type);
  }

  public placeCardToChannel(type: number, cardId: string, isReal: boolean) {
    const idx = this.cards.findIndex(c => c.id === cardId);
    if (idx < 0) {
      throw new Error('Card is not in your hand');
    }
    if (this.availableChannels.findIndex(c => c.type === type) < 0) {
      throw new Error('Channel unavailable');
    }
    const card = this.cards[idx];
    const cost = isReal ? card.info.cost : card.info.cost / 2;
    if (cost > this._gold) {
      throw new Error('Not enough gold');
    }
    if (this.channelSlots[type]) {
      this.cards.push(this.channelSlots[type]);
    }
    this.cards.splice(idx, 1);
    card.isReal = isReal;
    this._gold -= cost;
    this.channelSlots[type] = card;
  }

  public unplaceCardFromChannel(type: number) {
    if (!this.channelSlots[type]) {
      throw new Error('No card in this channel');
    }
    const card = this.channelSlots[type];
    this.channelSlots[type] = undefined;
    card.isReal = true;
    this.cards.push(card);
  }
}
