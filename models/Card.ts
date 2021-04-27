import { RandomGenerator } from '../utils/RandomGenerator';
import { CardData } from '../data/CardData';

export class Card {
  public id: string;

  constructor(public cardType: number, public isReal = true) {
    this.id = RandomGenerator.uuid();
  }

  public get info() {
    const cardInfo = CardData.getCard(this.cardType);
    return { id: this.id, type: this.cardType, ...cardInfo };
  }
}
