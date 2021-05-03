export class GameSetting {
  constructor(
    public numberOfRound = 10,
    public totalPeople = 1000,
    public startGold = 500,
    public startNumberOfCards = 5,
    public startPeople = 200,
    public eventRound = 4,
    public roundDealCards = 5,
    public roundSelectCards = 3,
    public roundTime = 120,
    public specialActionTime = 30,
  ) {}
}
