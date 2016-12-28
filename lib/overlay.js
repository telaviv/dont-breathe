import { Graphics } from 'pixi';

import { LERP } from 'animation';
import { BLACK, BLOCK_SIZE, COLUMNS, ROWS } from 'constants';

export default class Overlay {
  constructor() {
    this.animation = null;
    this.opacity = 0.5;
    this.graphics = new Graphics();
  }

  draw() {
    const graphics = this.graphics;
    graphics.clear();
    graphics.beginFill(BLACK, this.opacity);
    graphics.drawRect(0, 0, BLOCK_SIZE * COLUMNS, BLOCK_SIZE * ROWS);
    graphics.endFill();
    return graphics;
  }

  async animateTo(opacity, time) {
    this.animation = new LERP(time);
    this.startOpacity = this.opacity;
    this.endOpacity = opacity;
    await this.animation.start();
    this.animation = null;
  }

  update(dt) {
    if (this.animation) {
      const lvalue = this.animation.update(dt);
      const dOpacity = lvalue * (this.endOpacity - this.startOpacity);
      this.opacity = this.startOpacity + dOpacity;
    }
  }
}
