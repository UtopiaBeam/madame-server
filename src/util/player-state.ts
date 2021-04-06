import { Card, randomCards } from './card';
import { channels, channelSpeed } from './channels';
import { Player } from './player';

export type ChannelName = keyof typeof channelSpeed;

export class PlayerState extends Player {
  money: number;
  people: number;
  availableChannels: ChannelName[] = [];
  unavailableChannels: ChannelName[] = [];
  cards: Card[] = [];
  channelCards: Card[] = [null, null, null, null, null, null, null];
  ready = false;

  constructor(player: Player) {
    super(player.id, player.name, player.avatar);
  }

  addChannel(channel: ChannelName) {
    if (this.availableChannels.includes(channel)) {
      throw new Error('Channel bought');
    }

    let idx = this.availableChannels.reduce(
      (acc, c, idx) => (channelSpeed[c] < channelSpeed[channel] ? idx : acc),
      0,
    );

    this.availableChannels.splice(idx, 0, channel);
    idx = this.unavailableChannels.findIndex(c => c === channel);
    this.unavailableChannels.splice(idx, 1);
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

  addChannelCard(channel: ChannelName, cardId: string, isReal: boolean) {
    const channelIdx = this.findChannelIndex(channel);
    if (this.channelCards[channelIdx]) {
      throw new Error('Channel not empty');
    }

    const card = this.findCard(cardId);
    if (this.money < card.price) {
      throw new Error('Not enough money');
    }
    card.isReal = isReal;
    this.money -= card.price;
    this.channelCards[channelIdx] = card;
    this.removeCard(cardId);
  }

  removeChannelCard(channel: ChannelName) {
    const channelIdx = this.findChannelIndex(channel);
    if (!this.channelCards[channelIdx]) {
      throw new Error('Channel empty');
    }

    const card = this.channelCards[channelIdx];
    card.isReal = true;
    this.money += card.price;
    this.addCards([card]);
    this.channelCards[channelIdx] = null;
  }

  prepareNextTurn() {
    this.channelCards = [null, null, null, null, null, null, null];
    this.ready = false;
    this.addCards(randomCards(3));
  }

  start() {
    this.cards = randomCards();
    this.availableChannels = ['ปากต่อปาก', 'เว็บเพจ', 'สิ่งพิมพ์'];
    this.unavailableChannels = [
      'โซเชียลมีเดีย',
      'โทรทัศน์',
      'วิทยุ',
      'สื่อนอกบ้าน',
    ];
  }
}
