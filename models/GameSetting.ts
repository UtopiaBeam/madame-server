export class GameSetting {
  public numberOfRound = 5;
  public totalPeople = 999;
  public startGold = 500;
  public startNumberOfCards = 5;
  public startPeople = 200;
  public eventRound = 4;
  public roundDealCards = 5;
  public roundSelectCards = 3;
  public roundTime = 120;
  public specialActionTime = 30;

  constructor(params?: Partial<GameSetting>) {
    if (params) {
      Object.assign(this, params);
    }
  }

  update(params: Partial<GameSetting>) {
    Object.assign(this, params);
  }
}
