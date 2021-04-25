import { RandomGenerator } from '../utils/RandomGenerator';
import { CardData } from '../utils/CardData';

export class Card {
  public id: string;

  constructor(public cardType: number, public isReal = true) {
    this.id = RandomGenerator.uuid();
  }

  public getCardInfo() {
    const cardInfo = CardData.getCard(this.cardType);
    return { id: this.id, ...cardInfo };
  }
}
