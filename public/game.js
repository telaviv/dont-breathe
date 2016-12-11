const GREEN = 0x73fe00;
const RED = 0xFF3300;
const BLUE = 0x66CCFF;
const BLACK = 0X000000;
const BLOCK_SIZE = 32;
const COLUMNS = 32;
const ROWS = 24;

class EventQueue {
  constructor() {
    this.listeners = {};
    this.queue = [];
  }

  listen(eventType, cb) {
    if (this.listeners[eventType] !== undefined) {
      this.listeners[eventType].push(cb);
    } else {
      this.listeners[eventType] = [cb];
    }
  }

  enqueue(eventType, data) {
    if (this.listeners[eventType] === undefined) {
      return;
    }

    for (let cb of this.listeners[eventType]) {
      this.queue.push(() => cb(data));
    }
  }

  clearQueue() {
    for (let thunk of this.queue) {
      thunk();
    }
    this.queue = [];
  }
}
const eventQueue = new EventQueue();

class Keyboard {
  constructor() {
    this.keys = new Set([]);
    addEventListener('keydown', this.onDown.bind(this));
    addEventListener('keyup', this.onUp.bind(this));
  }

  onDown(event) {
    this.keys.add(event.code);
    eventQueue.enqueue('keydown', event.code);
  }

  onUp(event) {
    this.keys.delete(event.code);
  }
}
const keyboard = new Keyboard();


class O2Meter {
  constructor() {
    this.MAX_O2 = 1000;
    this.DEPLETION_RATE = 5;
    this.currentO2 = this.MAX_O2;
  }

  update(dt) {
    this.currentO2 = Math.max(0, this.currentO2 - this.DEPLETION_RATE * dt);
  }

  draw() {
    const rectangle = new PIXI.Graphics();
    const meterHeight = 64 * 6;
    const oxygenHeight = meterHeight - meterHeight * this.currentO2 / this.MAX_O2;

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

class Plant {
  draw() {
    const graphics = new PIXI.Graphics();
    graphics.lineStyle(4, GREEN, 1);
    graphics.drawRect(15, 5, 1, 20);
    graphics.drawRect(15, 11, 5, 1);
    graphics.drawRect(7, 5, 8, 1);
    return graphics;
  }
}

class Character {
  constructor() {
    this.keyDirections = {
      'ArrowUp': {x: 0, y: -1},
      'ArrowDown': {x: 0, y: 1},
      'ArrowLeft': {x: -1, y: 0},
      'ArrowRight': {x: 1, y: 0},
    }

    this.movementDelay = 0.25;
    this.moveCode = null;
    this.timeSinceLastMovement = 0;
    this.position = {x: 15 * BLOCK_SIZE, y: 15 * BLOCK_SIZE};
  }

  update(dt) {
    this.moveCode = this.findMoveCode();

    if (this.timeSinceLastMovement < this.movementDelay || this.moveCode === null) {
      this.timeSinceLastMovement += dt;
      return;
    }

    const direction = this.directionVector();
    const diffVector = this.scalarMultiply(direction, BLOCK_SIZE);
    this.position = this.addVectors(this.position, diffVector);
    this.timeSinceLastMovement = 0;
  }

  findMoveCode() {
    if (this.moveCode !== null && keyboard.keys.has(this.moveCode)) {
      return this.moveCode;
    }

    for (let moveCode of Object.keys(this.keyDirections)) {
      if (keyboard.keys.has(moveCode)) {
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

  normalizeVector(v) {
    const magnitude = Math.sqrt(v.x * v.x + v.y * v.y);
    return { x: v.x / magnitude, y: v.y / magnitude };
  }

  scalarMultiply(v, scale) {
    return {x: v.x * scale, y: v.y * scale};
  }

  draw() {
    const graphics = new PIXI.Graphics();
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

class GameScene {
  constructor() {
    this.stage = new Stage();
    this.o2meter = new O2Meter();
  }

  update(dt) {
    this.stage.update(dt);
    this.o2meter.update(dt);
  }


  draw() {
    const scene = new PIXI.Container();
    const stageSprite = this.stage.draw();
    const o2sprite = this.o2meter.draw();

    scene.addChild(stageSprite);
    scene.addChild(o2sprite);
    return scene;
  }
}

class Plants {
  constructor() {
    this.grid = [];
    for (let x = 0; x < ROWS; ++x) {
      const row = []
      for (let y = 0; y < COLUMNS; ++y) {
        row.push(null) ;
      }
      this.grid.push(row);
    }
    this.grid[10][10] = new Plant();
  }

  draw() {
    const scene = new PIXI.Container();
    for (let x = 0; x < ROWS; ++x) {
      for (let y = 0; y < COLUMNS; ++y) {
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

class Stage {
  constructor() {
    this.columns = 32;
    this.rows = 24;
    this.plants = new Plants();
    this.character = new Character();
    eventQueue.listen('keydown', this.onKeyDown.bind(this));
  }

  get width() {
    return BLOCK_SIZE * this.columns;
  }

  get height() {
    return BLOCK_SIZE * this.rows;
  }

  update(dt) {
    this.character.update(dt);
  }

  onKeyDown(data) {
    console.log('keydown~!');
  }

  drawBackground() {
    const graphics = new PIXI.Graphics();
    graphics.beginFill(0x7E6B8F);
    graphics.drawRect(0, 0, this.width, this.height);
    graphics.endFill();
    return graphics;
  }

  draw() {
    const stage = new PIXI.Container();
    const plantsSprite = this.plants.draw();
    const characterSprite = this.character.draw();

    stage.addChild(this.drawBackground());
    stage.addChild(plantsSprite);
    stage.addChild(characterSprite);

    stage.x = 500 - this.character.position.x;
    stage.y = 350 - this.character.position.y;
    return stage;
  }
}

class GameRunner {
  constructor() {
    this.gameScene = new GameScene();
    this.renderer = PIXI.autoDetectRenderer(1024, 768);
  }

  update(dt) {
    eventQueue.clearQueue();
    this.gameScene.update(dt);
    this.renderer.render(this.gameScene.draw());
  }

  run() {
    document.body.appendChild(this.renderer.view);

    const renderClock = new RenderClock();
    renderClock.run(this.update.bind(this));
  }
}

class RenderClock {

  run(cb) {
    let time = performance.now();

    const animationFrameCB = (ntime) => {
      const dt = ntime - time;
      time = ntime;
      cb(dt / 1000);
      requestAnimationFrame(animationFrameCB);
    }
    requestAnimationFrame(animationFrameCB);
  }
}


(new GameRunner).run();
