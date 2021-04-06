import { v4 as uuid } from 'uuid';

export type PeopleSide = 'neutral' | 'opponent' | 'player';

export class Card {
  readonly id: string;
  readonly name: string;
  isReal: boolean;
  readonly audioFactor: number;
  readonly textFactor: number;
  readonly visualFactor: number;
  readonly price: number;
  readonly effectType: 'pr' | 'attack';
  readonly from: PeopleSide;
  readonly to: PeopleSide;

  constructor(card: Omit<Card, 'id'>) {
    this.id = uuid();
    this.name = card.name;
    this.isReal = card.isReal;
    this.audioFactor = card.audioFactor;
    this.textFactor = card.textFactor;
    this.visualFactor = card.visualFactor;
    this.price = card.price;
    this.effectType = card.effectType;
    this.from = card.from;
    this.to = card.to;
  }
}

export const cards: Record<number, Omit<Card, 'id' | 'isReal'>> = {
  0: {
    name: 'แนะนำตัวต่อสาธารณะชน',
    audioFactor: 1,
    visualFactor: 1,
    textFactor: 1,
    price: 50,
    effectType: 'pr',
    from: 'neutral',
    to: 'player',
  },
  1: {
    name: 'โอ้ย ฉันทำงานหนักแหละ',
    audioFactor: 0,
    visualFactor: 0,
    textFactor: 5,
    price: 110,
    effectType: 'pr',
    from: 'neutral',
    to: 'player',
  },
  2: {
    name: 'ประกาศนโยบาย',
    audioFactor: 7,
    visualFactor: 2,
    textFactor: 1,
    price: 140,
    effectType: 'pr',
    from: 'neutral',
    to: 'player',
  },
  3: {
    name: 'รักนะยัยประชาชน',
    audioFactor: 0,
    visualFactor: 0,
    textFactor: 4,
    price: 100,
    effectType: 'pr',
    from: 'neutral',
    to: 'player',
  },
  4: {
    name: 'บริจาคการกุศล',
    audioFactor: 0,
    visualFactor: 20,
    textFactor: 0,
    price: 220,
    effectType: 'pr',
    from: 'neutral',
    to: 'player',
  },
  5: {
    name: 'ไปบ้านเด็กกำพร้า',
    audioFactor: 0,
    visualFactor: 7,
    textFactor: 0,
    price: 130,
    effectType: 'pr',
    from: 'neutral',
    to: 'player',
  },
  6: {
    name: 'รณรงค์เรื่องเพศหลากหลาย',
    audioFactor: 0,
    visualFactor: 0,
    textFactor: 14,
    price: 180,
    effectType: 'pr',
    from: 'neutral',
    to: 'player',
  },
  7: {
    name: 'ลงพื้นที่ไปหาชาวบ้าน',
    audioFactor: 15,
    visualFactor: 10,
    textFactor: 15,
    price: 320,
    effectType: 'pr',
    from: 'neutral',
    to: 'player',
  },
  8: {
    name: 'ฉันจบเกียรตินิยม มหาลัยชั้นนำนะจ๊ะ!',
    effectType: 'pr',
    from: 'neutral',
    to: 'player',
    audioFactor: 12,
    visualFactor: 0,
    textFactor: 12,
    price: 160,
  },
  9: {
    name: 'ร้องเพลงปลุกใจประชาชน',
    effectType: 'pr',
    from: 'neutral',
    to: 'player',
    audioFactor: 25,
    visualFactor: 0,
    textFactor: 0,
    price: 240,
  },
  10: {
    name: 'แอบปล่อยรูปหลุด',
    audioFactor: 0,
    visualFactor: 20,
    textFactor: 0,
    price: 300,
    effectType: 'attack',
    from: 'opponent',
    to: 'neutral',
  },
  11: {
    name: 'มันด่าประชาชน!!!',
    audioFactor: 8,
    visualFactor: 0,
    textFactor: 8,
    price: 140,
    effectType: 'attack',
    from: 'opponent',
    to: 'neutral',
  },
  12: {
    name: 'นโยบายเขาแย่',
    audioFactor: 10,
    visualFactor: 0,
    textFactor: 0,
    price: 150,
    effectType: 'attack',
    from: 'opponent',
    to: 'neutral',
  },
  13: {
    name: 'เธอ ซื้อ เสียง',
    audioFactor: 10,
    visualFactor: 10,
    textFactor: 15,
    price: 420,
    effectType: 'attack',
    from: 'opponent',
    to: 'neutral',
  },
  14: {
    name: 'นางทำงานไม่เป็น',
    audioFactor: 0,
    visualFactor: 3,
    textFactor: 2,
    price: 120,
    effectType: 'attack',
    from: 'opponent',
    to: 'neutral',
  },
  15: {
    name: 'ลูกชายนางเป็นเด็กเกเร',
    audioFactor: 0,
    visualFactor: 0,
    textFactor: 7,
    price: 130,
    effectType: 'attack',
    from: 'opponent',
    to: 'neutral',
  },
  16: {
    name: 'นางแอบล่าสัตว์สงวน',
    audioFactor: 20,
    visualFactor: 0,
    textFactor: 0,
    price: 200,
    effectType: 'attack',
    from: 'opponent',
    to: 'neutral',
  },
  17: {
    name: 'นางซื้อกระเป๋าจระเข้!',
    audioFactor: 0,
    visualFactor: 3,
    textFactor: 0,
    price: 60,
    effectType: 'attack',
    from: 'opponent',
    to: 'neutral',
  },
  18: {
    name: 'นางโพสต์บุลลี่เพื่อนค่า!!',
    audioFactor: 0,
    visualFactor: 0,
    textFactor: 25,
    price: 240,
    effectType: 'attack',
    from: 'opponent',
    to: 'neutral',
  },
};

export function randomCards(no = 5): Card[] {
  const result: Card[] = [];
  for (let i = 0; i < no; i++) {
    const cardNo = Math.floor(Math.random() * 19);
    const card = cards[cardNo];
    result.push(new Card({ ...card, isReal: true }));
  }

  return result;
}
