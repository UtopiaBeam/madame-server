import { v4 as uuid } from 'uuid';

export type PeopleSide = 'neutral' | 'opponent' | 'my';

export class Card {
  readonly id: string;
  readonly name: string;
  readonly isReal: boolean;
  readonly audioFactor: number;
  readonly textFactor: number;
  readonly visualFactor: number;
  readonly price: number;
  readonly effectType: 'pr' | 'attack';
  readonly from: PeopleSide;
  readonly to: PeopleSide;

  constructor(card: Card) {
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
