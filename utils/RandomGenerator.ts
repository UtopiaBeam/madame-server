import { v4 as uuid } from 'uuid';

export class RandomGenerator {
  public static integer(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  public static roomId(): string {
    const roomId = RandomGenerator.integer(0, 99999);
    return String(roomId).padStart(5, '0');
  }

  public static uuid(): string {
    return uuid();
  }
}
