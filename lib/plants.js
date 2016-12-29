import { Container, Graphics, Sprite } from 'pixi';

import {
  BLOCK_SIZE,
  ROWS, COLUMNS,
  GREEN, RED,
} from 'constants';
import { renderer } from 'graphics';

const createSaplingTexture = function() {
  const graphics = new Graphics();
  graphics.lineStyle(4, GREEN, 1);
  graphics.drawRect(15, 5, 1, 20);
  graphics.drawRect(15, 11, 5, 1);
  graphics.drawRect(7, 5, 8, 1);

  const texture = renderer.generateTexture(graphics);
  graphics.destroy();
  return texture;
};

const createFruitingTexture = function() {
  const graphics = new Graphics();
  graphics.lineStyle(4, GREEN, 1);
  graphics.drawRect(15, 5, 1, 20);
  graphics.drawRect(15, 11, 5, 1);
  graphics.drawRect(7, 5, 8, 1);
  graphics.lineStyle(4, RED, 1);
  graphics.drawRect(15, 0, 1, 1);

  const texture = renderer.generateTexture(graphics);
  graphics.destroy();
  return texture;
};

const SAPLING_TEXTURE = createSaplingTexture();
const FRUITING_TEXTURE = createFruitingTexture();

class Plant {
  constructor() {
    this.o2Generation = 0.25;
    this.state = 'sapling';
    this.sprite = new Sprite(SAPLING_TEXTURE);
  }

  get statusMessage() {
    if (this.state === 'fruiting') {
      return 'Looks like it\'s ready to harvest!';
    }
    return 'This plant is looking healthy!';
  }

  fruit() {
    this.state = 'fruiting';
    this.sprite.texture = FRUITING_TEXTURE;
  }

  harvest() {
    this.state = 'sapling';
    this.sprite.texture = SAPLING_TEXTURE;
    return { seeds: 1, fruit: 1 };
  }

  draw() {
    if (this.state === 'fruiting') {
      this.sprite.texture = FRUITING_TEXTURE;
    }
    this.sprite.texture = SAPLING_TEXTURE;
  }

  get display() {
    return this.sprite;
  }
}

export default class Plants {
  constructor() {
    this.scene = new Container();
    this.grid = [];
    for (let x = 0; x < COLUMNS; ++x) {
      const row = [];
      for (let y = 0; y < ROWS; ++y) {
        row.push(null) ;
      }
      this.grid.push(row);
    }
    this.addPlant({x: 10, y: 10});
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
          this.grid[x][y].fruit();
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
    this.scene.removeChildren();
    for (let x = 0; x < COLUMNS; ++x) {
      for (let y = 0; y < ROWS; ++y) {
        if (this.grid[x][y] !== null) {
          const plant = this.grid[x][y];
          plant.draw();
          plant.display.x = x * BLOCK_SIZE;
          plant.display.y = y * BLOCK_SIZE;
          this.scene.addChild(plant.display);
        }
      }
    }
    return this.scene;
  }
}
