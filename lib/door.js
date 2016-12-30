import { Graphics } from 'pixi';

import { PURPLE, BLOCK_SIZE } from 'constants';

export default class Door {
  constructor() {
    this.graphics = new Graphics();
  }

  draw() {
    this.graphics.clear();

    this.graphics.beginFill(PURPLE);
    this.graphics.drawRect(0, 0, BLOCK_SIZE, BLOCK_SIZE);
    this.graphics.endFill();
  }

  get display() {
    return this.graphics;
  }
}
