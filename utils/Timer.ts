import { io } from '..';

export class Timer {
  private _interval: NodeJS.Timeout;

  constructor(private readonly _gameId: string) {}

  public start(countdown: number) {
    this._interval = setInterval(() => {
      countdown--;
      io.to(this._gameId).emit('countdown', countdown);
      if (countdown === 0) {
        this.reset();
      }
    }, 1000);
  }

  public reset() {
    if (!this._interval) {
      clearInterval(this._interval);
    }
    this._interval = null;
  }
}
