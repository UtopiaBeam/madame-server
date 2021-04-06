export interface Channel {
  name: string;
  audio: number;
  visual: number;
  text: number;
  price: number;
}

export const channels = [
  {
    name: 'โซเชียลมีเดีย',
    audio: 1,
    visual: 1,
    text: 1,
    price: 500,
  },
  {
    name: 'ปากต่อปาก',
    audio: 1,
    visual: 0,
    text: 0,
    price: 0,
  },
  {
    name: 'เว็บเพจ',
    audio: 0,
    visual: 1,
    text: 1,
    price: 0,
  },
  {
    name: 'โทรทัศน์',
    audio: 1,
    visual: 1,
    text: 0,
    price: 300,
  },
  {
    name: 'วิทยุ',
    audio: 1,
    visual: 0,
    text: 0,
    price: 150,
  },
  {
    name: 'สิ่งพิมพ์',
    audio: 0,
    visual: 1,
    text: 1,
    price: 0,
  },
  {
    name: 'สื่อนอกบ้าน',
    audio: 0,
    visual: 1,
    text: 1,
    price: 250,
  },
];

export const channelSpeed = {
  โซเชียลมีเดีย: 0,
  ปากต่อปาก: 1,
  เว็บเพจ: 2,
  โทรทัศน์: 3,
  วิทยุ: 4,
  สิ่งพิมพ์: 5,
  สื่อนอกบ้าน: 6,
};
