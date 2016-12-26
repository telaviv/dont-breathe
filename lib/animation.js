export class LERP {
  constructor(time) {
    this.dt = 0;
    this.totalTime = time;
    this.started = false;
  }

  start() {
    this.started = true;
    return new Promise((resolve) => {
      this.resolve = resolve;
    });
  }

  update(dt) {
    if (!this.started) {
      return;
    }

    if (this.dt >= this.totalTime) {
      this.resolve();
    }
    this.dt += dt;
    return Math.min(1, this.dt / this.totalTime);
  }
}
