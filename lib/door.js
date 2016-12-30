import { Graphics } from 'pixi';

import { RED, PURPLE, BLOCK_SIZE } from 'constants';

export default class Door {
  constructor() {
    this.graphics = new Graphics();
    this.locked = true;
  }

  draw() {
    this.graphics.clear();

    this.graphics.beginFill(PURPLE);
    this.graphics.drawRect(0, 0, BLOCK_SIZE, BLOCK_SIZE);
    this.graphics.endFill();

    if (this.locked) {
      this.graphics.beginFill(RED);
      this.graphics.drawRect(
        BLOCK_SIZE / 4, BLOCK_SIZE / 4,
        BLOCK_SIZE / 2, BLOCK_SIZE / 2
      );
      this.graphics.endFill();
    }
  }

  get display() {
    return this.graphics;
  }
}
