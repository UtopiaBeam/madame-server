import { ChannelData } from '../utils/ChannelData';
import { RandomGenerator } from '../utils/RandomGenerator';
import { Card } from './Card';
import { Channel } from './Channel';

export class Player {
  public readonly id: string;
  public cards: Card[] = [];
  public availableChannels: Channel[];
  public unavailableChannels: Channel[];

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

  buyChannel(channelId: string) {
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
}
