import { Graphics } from 'pixi';

import { BLUE, RED, MAX_O2 } from 'constants';

export default class O2Meter {
  constructor() {
    this.oxygen = 750;
  }

  draw() {
    const rectangle = new Graphics();
    const meterHeight = 64 * 6;
    const oxygenHeight = meterHeight - meterHeight * this.oxygen / MAX_O2;

    // draw the outside meter
    rectangle.lineStyle(4, RED, 1);
    rectangle.beginFill(BLUE);
    rectangle.drawRect(0, 0, 64, meterHeight);
    rectangle.endFill();

    // draw the oxygen inside the meter
    rectangle.beginFill(RED);
    rectangle.drawRect(0, 0, 64, oxygenHeight);
    rectangle.endFill();

    rectangle.x = 50;
    rectangle.y = 50;

    return rectangle;
  }
}
