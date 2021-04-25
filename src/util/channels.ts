export enum ChannelName {
  Social = 'โซเชียลมีเดีย',
  Gossip = 'ปากต่อปาก',
  Webpage = 'เว็บเพจ',
  Television = 'โทรทัศน์',
  Radio = 'วิทยุ',
  Print = 'สิ่งพิมพ์',
  Billboard = 'สื่อนอกบ้าน',
}

export interface Channel {
  name: ChannelName;
  audio: number;
  visual: number;
  text: number;
  price: number;
  order: number;
}

export const channels: Channel[] = [
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

export function getChannel(channelName: ChannelName) {
  return channels.find(c => c.name === channelName);
}

export function findChannelIndex(channel: ChannelName) {
  return channels.findIndex(c => channel === c.name);
}
