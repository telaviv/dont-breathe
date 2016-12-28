import { Container, Graphics } from 'pixi';

import {
  BLOCK_SIZE,
  ROWS, COLUMNS,
  GREEN, RED,
} from 'constants';

class Plant {
  constructor() {
    this.o2Generation = 0.25;
    this.state = 'sapling';
  }

  get statusMessage() {
    if (this.state === 'fruiting') {
      return 'Looks like it\'s ready to harvest!';
    }
    return 'This plant is looking healthy!';
  }

  harvest() {
    this.state = 'sapling';
    return { seeds: 1, fruit: 1 };
  }

  draw() {
    const graphics = new Graphics();
    graphics.lineStyle(4, GREEN, 1);
    graphics.drawRect(15, 5, 1, 20);
    graphics.drawRect(15, 11, 5, 1);
    graphics.drawRect(7, 5, 8, 1);

    if (this.state === 'fruiting') {
      graphics.lineStyle(4, RED, 1);
      graphics.drawRect(15, 0, 1, 1);
    }
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

  plantAt(position) {
    const {x, y} = position;
    return this.grid[x][y];
  }

  plantStatus(position) {
    const {x, y} = position;
    return this.grid[x][y].statusMessage;
  }

  fruitPlants() {
    for (let x = 0; x < COLUMNS; ++x) {
      for (let y = 0; y < ROWS; ++y) {
        if (this.grid[x][y] !== null) {
          this.grid[x][y].state = 'fruiting';
        }
      }
    }
  }

  canHarvest(position) {
    return this.hasPlant(position) && this.plantAt(position).state === 'fruiting';
  }

  harvest(position) {
    return this.plantAt(position).harvest();
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
