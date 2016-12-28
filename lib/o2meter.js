import { Graphics } from 'pixi';

import { BLUE, RED, MAX_O2 } from 'constants';

export default class O2Meter {
  constructor() {
    this.graphics = new Graphics();
    this.oxygen = 750;
  }

  get oxygen() {
    return this._oxygen;
  }

  set oxygen(value) {
    this._oxygen = value;

    const meterHeight = 64 * 6;
    const oxygenHeight = meterHeight - meterHeight * this.oxygen / MAX_O2;

    this.graphics.clear();

    // draw the outside meter
    this.graphics.lineStyle(4, RED, 1);
    this.graphics.beginFill(BLUE);
    this.graphics.drawRect(0, 0, 64, meterHeight);
    this.graphics.endFill();

    // draw the oxygen inside the meter
    this.graphics.beginFill(RED);
    this.graphics.drawRect(0, 0, 64, oxygenHeight);
    this.graphics.endFill();

    this.graphics.x = 50;
    this.graphics.y = 50;
  }

  draw() {
    return this.graphics;
  }
}
