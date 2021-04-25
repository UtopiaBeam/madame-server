export class Timer {
  private _interval: NodeJS.Timeout;

  public start(countdown: number) {
    this._interval = setInterval(() => {
      countdown--;
      // TODO: Emit event
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
