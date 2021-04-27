export enum EffectType {
  PR = 'pr',
  Attack = 'attack',
}

export interface CardDetail {
  name: string;
  audioFactor: number;
  visualFactor: number;
  textFactor: number;
  cost: number;
  effectType: EffectType;
}

export class CardData {
  public static cards: Record<number, CardDetail> = {
    0: {
      name: 'แนะนำตัวต่อสาธารณะชน',
      audioFactor: 0.01,
      visualFactor: 0.01,
      textFactor: 0.01,
      cost: 50,
      effectType: EffectType.PR,
    },
    1: {
      name: 'โอ้ย ฉันทำงานหนักแหละ',
      audioFactor: 0,
      visualFactor: 0,
      textFactor: 0.05,
      cost: 110,
      effectType: EffectType.PR,
    },
    2: {
      name: 'ประกาศนโยบาย',
      audioFactor: 0.07,
      visualFactor: 0.02,
      textFactor: 0.01,
      cost: 140,
      effectType: EffectType.PR,
    },
    3: {
      name: 'รักนะยัยประชาชน',
      audioFactor: 0,
      visualFactor: 0,
      textFactor: 0.04,
      cost: 100,
      effectType: EffectType.PR,
    },
    4: {
      name: 'บริจาคการกุศล',
      audioFactor: 0,
      visualFactor: 0.2,
      textFactor: 0,
      cost: 220,
      effectType: EffectType.PR,
    },
    5: {
      name: 'ไปบ้านเด็กกำพร้า',
      audioFactor: 0,
      visualFactor: 0.07,
      textFactor: 0,
      cost: 130,
      effectType: EffectType.PR,
    },
    6: {
      name: 'รณรงค์เรื่องเพศหลากหลาย',
      audioFactor: 0,
      visualFactor: 0,
      textFactor: 0.14,
      cost: 180,
      effectType: EffectType.PR,
    },
    7: {
      name: 'ลงพื้นที่ไปหาชาวบ้าน',
      audioFactor: 0.15,
      visualFactor: 0.1,
      textFactor: 0.15,
      cost: 320,
      effectType: EffectType.PR,
    },
    8: {
      name: 'ฉันจบเกียรตินิยม มหาลัยชั้นนำนะจ๊ะ!',
      effectType: EffectType.PR,
      audioFactor: 12,
      visualFactor: 0,
      textFactor: 12,
      cost: 160,
    },
    9: {
      name: 'ร้องเพลงปลุกใจประชาชน',
      effectType: EffectType.PR,
      audioFactor: 0.25,
      visualFactor: 0,
      textFactor: 0,
      cost: 240,
    },
    10: {
      name: 'แอบปล่อยรูปหลุด',
      audioFactor: 0,
      visualFactor: 0.2,
      textFactor: 0,
      cost: 300,
      effectType: EffectType.Attack,
    },
    11: {
      name: 'มันด่าประชาชน!!!',
      audioFactor: 0.08,
      visualFactor: 0,
      textFactor: 0.08,
      cost: 140,
      effectType: EffectType.Attack,
    },
    12: {
      name: 'นโยบายเขาแย่',
      audioFactor: 0.1,
      visualFactor: 0,
      textFactor: 0,
      cost: 150,
      effectType: EffectType.Attack,
    },
    13: {
      name: 'เธอ ซื้อ เสียง',
      audioFactor: 0.1,
      visualFactor: 0.1,
      textFactor: 0.15,
      cost: 420,
      effectType: EffectType.Attack,
    },
    14: {
      name: 'นางทำงานไม่เป็น',
      audioFactor: 0,
      visualFactor: 0.03,
      textFactor: 0.02,
      cost: 120,
      effectType: EffectType.Attack,
    },
    15: {
      name: 'ลูกชายนางเป็นเด็กเกเร',
      audioFactor: 0,
      visualFactor: 0,
      textFactor: 0.07,
      cost: 130,
      effectType: EffectType.Attack,
    },
    16: {
      name: 'นางแอบล่าสัตว์สงวน',
      audioFactor: 0.2,
      visualFactor: 0,
      textFactor: 0,
      cost: 200,
      effectType: EffectType.Attack,
    },
    17: {
      name: 'นางซื้อกระเป๋าจระเข้!',
      audioFactor: 0,
      visualFactor: 0.03,
      textFactor: 0,
      cost: 60,
      effectType: EffectType.Attack,
    },
    18: {
      name: 'นางโพสต์บุลลี่เพื่อนค่า!!',
      audioFactor: 0,
      visualFactor: 0,
      textFactor: 0.25,
      cost: 240,
      effectType: EffectType.Attack,
    },
  };

  public static getCard(cardType: number) {
    return this.cards[cardType];
  }

  public static get totalTypes(): number {
    return Object.keys(this.cards).length;
  }
}
