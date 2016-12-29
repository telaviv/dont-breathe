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
    this.graphics = new Graphics();
  }

  get statusMessage() {
    if (this.state === 'fruiting') {
      return 'Looks like it\'s ready to harvest!';
    }
    return 'This plant is looking healthy!';
  }

  fruit() {
    this.state = 'fruiting';
  }

  harvest() {
    this.state = 'sapling';
    return { seeds: 1, fruit: 1 };
  }

  draw() {
    this.graphics.clear();
    this.graphics.lineStyle(4, GREEN, 1);
    this.graphics.drawRect(15, 5, 1, 20);
    this.graphics.drawRect(15, 11, 5, 1);
    this.graphics.drawRect(7, 5, 8, 1);

    if (this.state === 'fruiting') {
      this.graphics.lineStyle(4, RED, 1);
      this.graphics.drawRect(15, 0, 1, 1);
    }
  }

  get display() {
    return this.graphics;
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
    for (let { plant } of this.plants()) {
      plant.fruit();
    }
  }

  *plants() {
    for (let x = 0; x < COLUMNS; ++x) {
      for (let y = 0; y < ROWS; ++y) {
        if (this.grid[x][y] !== null) {
          yield { plant: this.grid[x][y], x, y };
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
    for (let { plant } of this.plants()) {
      sum += plant.o2Generation;
    }
    return sum;
  }

  draw() {
    this.scene.removeChildren();
    for (let { plant, x, y } of this.plants()) {
      plant.draw();
      plant.display.x = x * BLOCK_SIZE;
      plant.display.y = y * BLOCK_SIZE;
      this.scene.addChild(plant.display);
    }
    return this.scene;
  }
}
