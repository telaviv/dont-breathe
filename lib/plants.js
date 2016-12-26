import { Container, Graphics } from 'pixi';

import { BLOCK_SIZE, COLUMNS, GREEN, ROWS } from 'constants';

class Plant {
  constructor() {
    this.o2Generation = 0.25;
  }

  get statusMessage() {
    return 'This plant is looking healthy!';
  }

  draw() {
    const graphics = new Graphics();
    graphics.lineStyle(4, GREEN, 1);
    graphics.drawRect(15, 5, 1, 20);
    graphics.drawRect(15, 11, 5, 1);
    graphics.drawRect(7, 5, 8, 1);
    return graphics;
  }
}

export default class Plants {
  constructor() {
    this.grid = [];
    for (let x = 0; x < COLUMNS; ++x) {
      const row = [];
      for (let y = 0; y < ROWS; ++y) {
        row.push(null) ;
      }
      this.grid.push(row);
    }
    this.grid[10][10] = new Plant();
  }

  hasPlant(position) {
    const {x, y} = position;
    return !!this.grid[x][y];
  }

  addPlant(position) {
    const {x, y} = position;
    this.grid[x][y] = new Plant();
  }

  plantStatus(position) {
    const {x, y} = position;
    return this.grid[x][y].statusMessage;
  }


  o2GenerationRate() {
    let sum = 0;
    for (let x = 0; x < COLUMNS; ++x) {
      for (let y = 0; y < ROWS; ++y) {
        if (this.grid[x][y] !== null) {
          sum += this.grid[x][y].o2Generation;
        }
      }
    }
    return sum;
  }


  draw() {
    const scene = new Container();
    for (let x = 0; x < COLUMNS; ++x) {
      for (let y = 0; y < ROWS; ++y) {
        if (this.grid[x][y] !== null) {
          const sprite = this.grid[x][y].draw();
          sprite.x = x * BLOCK_SIZE;
          sprite.y = y * BLOCK_SIZE;
          scene.addChild(sprite);
        }
      }
    }
    return scene;
  }
}