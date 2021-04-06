import { Card } from './card';
import { Player } from './player';

const channels = {
  socialMedia: 0,
  mouth: 1,
  webpage: 2,
  tv: 3,
  radio: 4,
  newspaper: 5,
  billboard: 6,
};

export type Channel = keyof typeof channels;

export class PlayerState extends Player {
  money: number;
  people: number;
  channels: Channel[] = [];
  cards: Card[] = [];
  ready = false;

  constructor(player: Player) {
    super(player.id, player.name, player.avatar);
  }

  addPeople(count: number) {
    this.people += count;
    if (this.people < 0) {
      throw new Error('Negative people');
    }
  }

  addChannel(channel: Channel) {
    if (this.channels.includes(channel)) {
      throw new Error('Channel bought');
    }

    const idx = this.channels.reduce(
      (acc, c, idx) => (channels[c] < channels[channel] ? idx : acc),
      0,
    );

    this.channels.splice(idx, 0, channel);
  }

  addCards(card: Card[]) {
    this.cards.push(...card);
  }

  removeCard(id: string) {
    const idx = this.cards.findIndex(c => c.id === id);
    this.cards.splice(idx, 1);
  }
}
