export enum ChannelName {
  Social = 'โซเชียลมีเดีย',
  Gossip = 'ปากต่อปาก',
  Webpage = 'เว็บเพจ',
  Television = 'โทรทัศน์',
  Radio = 'วิทยุ',
  Print = 'สิ่งพิมพ์',
  Billboard = 'สื่อนอกบ้าน',
}

export class ChannelData {
  public static channels = [
    {
      name: ChannelName.Social,
      audio: 1,
      visual: 1,
      text: 1,
      price: 500,
      order: 0,
    },
    {
      name: ChannelName.Gossip,
      audio: 1,
      visual: 0,
      text: 0,
      price: 0,
      order: 1,
    },
    {
      name: ChannelName.Webpage,
      audio: 0,
      visual: 1,
      text: 1,
      price: 0,
      order: 2,
    },
    {
      name: ChannelName.Television,
      audio: 1,
      visual: 1,
      text: 0,
      price: 300,
      order: 3,
    },
    {
      name: ChannelName.Radio,
      audio: 1,
      visual: 0,
      text: 0,
      price: 150,
      order: 4,
    },
    {
      name: ChannelName.Print,
      audio: 0,
      visual: 1,
      text: 1,
      price: 0,
      order: 5,
    },
    {
      name: ChannelName.Billboard,
      audio: 0,
      visual: 1,
      text: 1,
      price: 250,
      order: 6,
    },
  ];

  public static getChannel(channelType: number) {
    return this.channels[channelType];
  }

  public static get freeChannels() {
    return this.channels.filter(c => c.price === 0);
  }

  public static get paidChannels() {
    return this.channels.filter(c => c.price === 0);
  }
}
