import { Graphics } from 'pixi';

import { COLUMNS, ROWS, BLACK, RED, BLOCK_SIZE } from 'constants';
import { clamp } from 'utilities';

export default class Character {
  constructor(keyboard) {
    this.keyDirections = {
      'ArrowUp': {x: 0, y: -1},
      'ArrowDown': {x: 0, y: 1},
      'ArrowLeft': {x: -1, y: 0},
      'ArrowRight': {x: 1, y: 0},
    };
    this.keyboard = keyboard;
    this.inventory = { seeds: 5 };
    this.movementDelay = 0.1;
    this.moveCode = null;
    this.timeSinceLastMovement = 0;
    this.position = {x: 15 * BLOCK_SIZE, y: 15 * BLOCK_SIZE};
    this.o2Consumption = 5.0;
  }

  update(dt) {
    this.moveCode = this.findMoveCode();

    if (this.timeSinceLastMovement < this.movementDelay || this.moveCode === null) {
      this.timeSinceLastMovement += dt;
      return;
    }

    const direction = this.directionVector();
    const diffVector = this.scalarMultiply(direction, BLOCK_SIZE);
    const addedPosition = this.addVectors(this.position, diffVector);
    this.position = this.clampPosition(addedPosition);
    this.timeSinceLastMovement = 0;
  }

  findMoveCode() {
    if (this.moveCode !== null && this.keyboard.keys.has(this.moveCode)) {
      return this.moveCode;
    }

    for (let moveCode of Object.keys(this.keyDirections)) {
      if (this.keyboard.keys.has(moveCode)) {
        return moveCode;
      }
    }
    return null;
  }

  directionVector() {
    if (this.moveCode === null) {
      return {x: 0, y: 0};
    }
    return this.keyDirections[this.moveCode];
  }

  addVectors(a, b) {
    return {x: a.x + b.x, y: a.y + b.y};
  }

  scalarMultiply(v, scale) {
    return {x: v.x * scale, y: v.y * scale};
  }

  clampPosition(position) {
    return {
      x: clamp(position.x, 0, BLOCK_SIZE * (COLUMNS - 1)),
      y: clamp(position.y, 0, BLOCK_SIZE * (ROWS - 1)),
    };
  }

  get gridPosition() {
    return {
      x: this.position.x / BLOCK_SIZE,
      y: this.position.y / BLOCK_SIZE,
    };
  }

  draw() {
    const graphics = new Graphics();
    graphics.beginFill(RED);
    graphics.drawRect(8, 4, 16, 28);
    graphics.endFill();

    graphics.beginFill(BLACK);
    graphics.drawRect(12, 8, 8, 8);
    graphics.endFill();

    graphics.x = this.position.x;
    graphics.y = this.position.y;

    return graphics;
  }
}