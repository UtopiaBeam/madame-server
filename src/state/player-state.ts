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

export class PlayerState {
  money: number;
  people: number;
  channels: Channel[];
  cards: unknown[];

  constructor(readonly name: string, readonly avatar: string) {}

  addMoney(money: number) {
    this.money += money;
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
}
