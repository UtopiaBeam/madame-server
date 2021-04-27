export class GameSetting {
  constructor(
    private _numberOfRound = 10,
    private _totalPeople = 1000,
    private _startGold = 500,
    private _startNumberOfCards = 5,
    private _startPeople = 200,
    private _roundDealCards = 5,
    private _roundSelectCards = 3,
    private _roundTime = 120,
    private _specialActionTime = 30,
  ) {}

  get numberOfRound(): number {
    return this._numberOfRound;
  }

  get totalPeople(): number {
    return this._totalPeople;
  }

  get startGold(): number {
    return this._startGold;
  }

  get startNumberOfCards(): number {
    return this._startNumberOfCards;
  }

  get startPeople(): number {
    return this._startPeople;
  }

  get roundDealCards(): number {
    return this._roundDealCards;
  }

  get roundSelectCards(): number {
    return this._roundSelectCards;
  }

  get roundTime(): number {
    return this._roundTime;
  }

  get specialActionTime(): number {
    return this._specialActionTime;
  }
}
