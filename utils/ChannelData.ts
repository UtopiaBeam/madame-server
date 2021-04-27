export enum ChannelName {
  Social = 'โซเชียลมีเดีย',
  Gossip = 'ปากต่อปาก',
  Webpage = 'เว็บเพจ',
  Television = 'โทรทัศน์',
  Radio = 'วิทยุ',
  Print = 'สิ่งพิมพ์',
  Billboard = 'สื่อนอกบ้าน',
}

export interface ChannelDetail {
  name: ChannelName;
  audio: number;
  visual: number;
  text: number;
  price: number;
  channelType: number;
  baseFactor: number;
}

export class ChannelData {
  public static channels = [
    {
      name: ChannelName.Social,
      audio: 1,
      visual: 1,
      text: 1,
      price: 500,
      channelType: 0,
      baseFactor: 0.2,
    },
    {
      name: ChannelName.Gossip,
      audio: 1,
      visual: 0,
      text: 0,
      price: 0,
      channelType: 1,
      baseFactor: 0.03,
    },
    {
      name: ChannelName.Webpage,
      audio: 0,
      visual: 1,
      text: 1,
      price: 0,
      channelType: 2,
      baseFactor: 0.05,
    },
    {
      name: ChannelName.Television,
      audio: 1,
      visual: 1,
      text: 0,
      price: 300,
      channelType: 3,
      baseFactor: 0.12,
    },
    {
      name: ChannelName.Radio,
      audio: 1,
      visual: 0,
      text: 0,
      price: 150,
      channelType: 4,
      baseFactor: 0.05,
    },
    {
      name: ChannelName.Print,
      audio: 0,
      visual: 1,
      text: 1,
      price: 0,
      channelType: 5,
      baseFactor: 0.08,
    },
    {
      name: ChannelName.Billboard,
      audio: 0,
      visual: 1,
      text: 1,
      price: 250,
      channelType: 6,
      baseFactor: 0.1,
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
