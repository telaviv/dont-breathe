import { Graphics } from 'pixi';

import { LERP } from 'animation';
import { BLACK, BLOCK_SIZE, COLUMNS, ROWS } from 'constants';

export default class Overlay {
  constructor() {
    this.animation = null;
    this.opacity = 0.5;
  }

  draw() {
    const graphics = new Graphics();
    graphics.beginFill(BLACK, this.opacity);
    graphics.drawRect(0, 0, BLOCK_SIZE * COLUMNS, BLOCK_SIZE * ROWS);
    graphics.endFill();
    return graphics;
  }

  async fadeIn(time) {
    this.animation = new LERP(time);
    await this.animation.start();
    this.animation = null;
  }

  update(dt) {
    if (this.animation) {
      const lvalue = this.animation.update(dt);
      this.opacity = 1 - lvalue;
    }
  }
}
