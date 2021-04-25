export class GameSetting {
  constructor(
    private _numberOfRound = 10,
    private _startGold = 500,
    private _startNumberOfCards = 5,
    private _startPeople = 200,
    private _totalPeople = 1000,
    private _roundGold = 100,
    private _roundTime = 120,
    private _specialActionTime = 30,
  ) {}

  get numberOfRound(): number {
    return this._numberOfRound;
  }

  get startGold(): number {
    return this._startGold;
  }

  get startNumberOfCards(): number {
    return this._startNumberOfCards;
  }

  get roundTime(): number {
    return this._roundTime;
  }

  get roundGold(): number {
    return this._roundGold;
  }

  get specialActionTime(): number {
    return this._specialActionTime;
  }

  set numberOfRound(numberOfRound: number) {
    if (numberOfRound < 0) {
      throw new Error('Number of round cannot be negative');
    }
    this._numberOfRound = numberOfRound;
  }

  set startGold(startGold: number) {
    if (startGold < 0) {
      throw new Error('Start gold cannot be negative');
    }
    this._startGold = startGold;
  }

  set startNumberOfCards(startNumberOfCards: number) {
    if (startNumberOfCards < 0) {
      throw new Error('Start gold cannot be negative');
    }
    this._startNumberOfCards = startNumberOfCards;
  }

  set roundTime(roundTime: number) {
    if (roundTime < 0) {
      throw new Error('Round time cannot be negative');
    }
    this._roundTime = roundTime;
  }

  set roundGold(roundGold: number) {
    if (roundGold < 0) {
      throw new Error('Round gold cannot be negative');
    }
    this._roundGold = roundGold;
  }

  set specialActionTime(specialActionTime: number) {
    if (specialActionTime < 0) {
      throw new Error('Special action time cannot be negative');
    }
    this._specialActionTime = specialActionTime;
  }
}
