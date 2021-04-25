import { RandomGenerator } from '../utils/RandomGenerator';
import { Card } from './Card';

export class Player {
  public readonly id: string;
  public cards: Card[] = [];

  private _gold: number = 500;

  constructor(public readonly name: string, public readonly avatar: string) {
    this.id = RandomGenerator.uuid();
  }

  get gold(): number {
    return this._gold;
  }

  set gold(newGold: number) {
    if (newGold < 0) {
      throw new Error('Gold cannot be negative');
    }
    this._gold = newGold;
  }
}
