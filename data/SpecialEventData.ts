export interface SpecialEventDetail {
  name: string;
  description: string;
  channelEffect: number[];
  cardEffect: {
    audio: number;
    visual: number;
    text: number;
    allowFake: boolean;
  };
}

export class SpecialEventData {
  public static events: SpecialEventDetail[] = [
    {
      name: 'กองเซนเซอร์ลง',
      description: 'สื่อทุกสื่อได้รับการตรวจสอบ ไม่สามารถใช้การ์ด Fake ได้',
      channelEffect: [1, 1, 1, 1, 1, 1, 1],
      cardEffect: {
        audio: 1,
        visual: 1,
        text: 1,
        allowFake: false,
      },
    },
    {
      name: 'พายุเข้า',
      description:
        'สัญญาณดาวเทียมขัดข้อง สื่อโทรทัศน์และวิทยุไม่สามารถใช้งานได้ นอกจากนั้นโซเชียลมีเดียและเว็บเพจมีประสิทธิภาพน้อยลง 50% เนื่องมาจากอินเทอร์เน็ตที่ช้าลง',
      channelEffect: [0.5, 1, 0.5, 0, 0, 1, 1],
      cardEffect: {
        audio: 1,
        visual: 1,
        text: 1,
        allowFake: true,
      },
    },
    {
      name: 'ไวรัสระบาด',
      description:
        'เดินทางออกจากบ้านไม่ได้ ทำให้ช่องทางปากต่อปากและสื่อนอกบ้านไม่สามารถใช้งานได้ ในชณะเดียวกันโซเชียลมีเดียมีประสิทธิภาพมากขึ้น 20%',
      channelEffect: [1.2, 0, 1, 1, 1, 1, 0],
      cardEffect: {
        audio: 1,
        visual: 1,
        text: 1,
        allowFake: true,
      },
    },
    {
      name: 'hacker',
      description:
        'ทางรัฐบาลไม่แนะนำให้ใช้อินเตอร์เน็ต โซเชียลมีเดียและเว็บเพจจึงใช้งานไม่ได้',
      channelEffect: [0, 1, 0, 1, 1, 1, 1],
      cardEffect: {
        audio: 1,
        visual: 1,
        text: 1,
        allowFake: true,
      },
    },
    {
      name: 'เกิดเหตุขัดข้องที่โรงพิมพ์',
      description: 'สิ่งพิมพ์และสื่อนอกบ้านไม่สามารถใช้งานได้',
      channelEffect: [1, 1, 1, 1, 1, 0, 0],
      cardEffect: {
        audio: 1,
        visual: 1,
        text: 1,
        allowFake: true,
      },
    },
    {
      name: 'มีบริการตัดแว่นฟรี',
      description:
        'เห็นชัดขึ้น ทำให้เนื้อหาประเภทภาพมีประสิทธิภาพเพิ่มขึ้นเป็นสองเท่า',
      channelEffect: [1, 1, 1, 1, 1, 1, 1],
      cardEffect: {
        audio: 1,
        visual: 2,
        text: 1,
        allowFake: true,
      },
    },
    {
      name: 'มีเทศกาลดนตรีนอกเมือง',
      description:
        'คนขับรถออกนอกเมืองเยอะขึ้น สื่อประเภทปากต่อปาก วิทยุ และสื่อนอกบ้านมีประสิทธิภาพมากขึ้น 50%',
      channelEffect: [1.5, 1, 1, 1, 1.5, 1, 1.5],
      cardEffect: {
        audio: 1,
        visual: 1,
        text: 1,
        allowFake: true,
      },
    },
  ];

  public static event(type: number) {
    return this.events[type];
  }
}
