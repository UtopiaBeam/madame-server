import { v4 as uuid } from 'uuid';
import { CardData } from '../data/CardData';
import { SpecialEvent, SpecialEventData } from '../data/SpecialEventData';

export class RandomGenerator {
  public static integer(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  public static gameId(): string {
    const gameId = RandomGenerator.integer(0, 99999);
    return String(gameId).padStart(5, '0');
  }

  public static uuid(): string {
    return uuid();
  }

  public static cardType(round: number): number {
    const idx = CardData.cards.findIndex(c => c.availableRound === round + 1);
    const maxType = (idx < 0 ? CardData.cards.length : idx) - 1;
    return this.integer(0, maxType);
  }

  public static event(): SpecialEvent {
    const type = this.integer(0, SpecialEventData.events.length - 1);
    return SpecialEventData.event(type);
  }
}
