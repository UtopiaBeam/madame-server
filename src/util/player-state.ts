import { Card } from './card';
import { channels, channelSpeed } from './channels';
import { Player } from './player';

export type ChannelName = keyof typeof channelSpeed;

export class PlayerState extends Player {
  money: number;
  people: number;
  channels: ChannelName[] = [];
  cards: Card[] = [];
  channelCards: Card[] = [null, null, null, null, null, null, null];
  ready = false;

  constructor(player: Player) {
    super(player.id, player.name, player.avatar);
  }

  addChannel(channel: ChannelName) {
    if (this.channels.includes(channel)) {
      throw new Error('Channel bought');
    }

    const idx = this.channels.reduce(
      (acc, c, idx) => (channelSpeed[c] < channelSpeed[channel] ? idx : acc),
      0,
    );

    this.channels.splice(idx, 0, channel);
  }

  findCardIndex(id: string) {
    return this.cards.findIndex(c => c.id === id);
  }

  findCard(id: string) {
    return this.cards.find(c => c.id === id);
  }

  addCards(card: Card[]) {
    this.cards.push(...card);
  }

  removeCard(id: string) {
    const idx = this.findCardIndex(id);
    this.cards.splice(idx, 1);
  }

  findChannelIndex(channel: ChannelName) {
    return channels.findIndex(c => channel === c.name);
  }

  addChannelCard(channel: ChannelName, cardId: string) {
    const channelIdx = this.findChannelIndex(channel);
    if (this.channelCards[channelIdx]) {
      throw new Error('Channel not empty');
    }

    this.channelCards[channelIdx] = this.findCard(cardId);
    this.removeCard(cardId);
  }

  removeChannelCard(channel: ChannelName) {
    const channelIdx = this.findChannelIndex(channel);
    if (!this.channelCards[channelIdx]) {
      throw new Error('Channel empty');
    }

    this.channelCards[channelIdx] = null;
  }
}
