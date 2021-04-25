import { Card, randomCards } from './card';
import {
  Channel,
  ChannelName,
  channels,
  findChannelIndex,
  getChannel,
} from './channels';
import { Player } from './player';

export class PlayerState extends Player {
  money: number;
  people: number;
  availableChannels: Channel[] = [];
  unavailableChannels: Channel[] = [];
  cards: Card[] = [];
  channelCards: Card[] = [null, null, null, null, null, null, null];
  ready = false;

  constructor(player: Player) {
    super(player.id, player.name, player.avatar);
  }

  hasAvailableChannel(channelName: ChannelName): boolean {
    return this.availableChannels.some(channel => channel.name === channelName);
  }

  buyChannel(channelName: ChannelName) {
    if (this.hasAvailableChannel(channelName)) {
      throw new Error('Channel bought');
    }

    const channel = getChannel(channelName);
    if (channel.price > this.money) {
      throw new Error('Not enough money');
    }

    let idx = this.availableChannels.reduce(
      (acc, c, idx) => (c.order < channel.order ? idx : acc),
      0,
    );

    this.availableChannels.splice(idx, 0, channel);
    idx = this.unavailableChannels.findIndex(c => c === channel);
    this.unavailableChannels.splice(idx, 1);

    this.money -= channel.price;
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

  addChannelCard(channel: ChannelName, cardId: string, isReal: boolean) {
    const channelIdx = findChannelIndex(channel);
    if (this.channelCards[channelIdx]) {
      throw new Error('Channel not empty');
    }

    const card = this.findCard(cardId);
    const price = card.isReal ? card.price : card.price / 2;
    if (this.money < price) {
      throw new Error('Not enough money');
    }
    card.isReal = isReal;
    this.money -= price;
    this.channelCards[channelIdx] = card;
    this.removeCard(cardId);
  }

  removeChannelCard(channel: ChannelName) {
    const channelIdx = findChannelIndex(channel);
    if (!this.channelCards[channelIdx]) {
      throw new Error('Channel empty');
    }

    const card = this.channelCards[channelIdx];
    const price = card.isReal ? card.price : card.price / 2;
    card.isReal = true;
    this.money += price;
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
    this.availableChannels = [channels[1], channels[2], channels[5]];
    this.unavailableChannels = [
      channels[0],
      channels[3],
      channels[4],
      channels[6],
    ];
  }
}
