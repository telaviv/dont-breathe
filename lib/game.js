const GREEN = 0x73fe00;
const RED = 0xFF3300;
const BLUE = 0x66CCFF;
const BROWN = 0x4B5043;
const CHOCOLATE = 0x663931;
const WHITE = 0XFFFFFF;
const BLACK = 0X000000;
const BLOCK_SIZE = 32;
const COLUMNS = 32;
const ROWS = 24;
const MAX_O2 = 1000;

const INTRO_TEXT = [
  '[ press any key ]',
  ' ... ... ',
  '.........',
  ' just ... ',
  '... ...',
  '.........',
  'breathe.',
  '',
  "I don't have much oxygen left.",
  "but ...",
  'I still need to breathe.',
  '',
  '......',
  "Let's keep calm.",
  "We still have a few seeds left.",
]

const inventory = {
  seeds: 5,
}

const clamp = (value, min, max) => {
  if (value > max) {
    return max;
  } else if (value < min) {
    return  min;
  }
  return value;
}

class LERP {
  constructor(time) {
    this.dt = 0;
    this.totalTime = time;
    this.started = false;
  }

  start() {
    this.started = true;
    return new Promise((resolve) => {
      this.resolve = resolve;
    });
  }

  update(dt) {
    if (!this.started) {
      return;
    }

    if (this.dt >= this.totalTime) {
      this.resolve();
    }
    this.dt += dt;
    return Math.min(1, this.dt / this.totalTime);
  }
}

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

  executeQueue() {
    for (let thunk of this.queue) {
      thunk();
    }
    this.queue = [];
  }

  clearQueue() {
    this.queue = [];
  }
}
const mainEventQueue = new EventQueue();

class Keyboard {
  constructor(eventQueue) {
    this.keys = new Set([]);
    this.eventQueue = eventQueue;
    addEventListener('keydown', this.onDown.bind(this));
    addEventListener('keyup', this.onUp.bind(this));
  }

  onDown(event) {
    this.keys.add(event.code);
    this.eventQueue.enqueue('keydown', event.code);
  }

  onUp(event) {
    this.keys.delete(event.code);
  }
}
const keyboard = new Keyboard(mainEventQueue);

class AsyncKeyboard {

  constructor() {
    this.listening = false;
    addEventListener('keydown', this.onKeyDown.bind(this));
  }

  nextKey() {
    this.listening = true;
    return new Promise((resolve) => {
      this.resolve = resolve
    })
  }

  onKeyDown(event) {
    if (this.listening) {
      this.listening = false;
      this.resolve(event.code);
    }
  }
}

class SeedInventory {
  constructor() {
    this.texture = PIXI.Texture.fromImage('seeds.png');
    this.text = new PIXI.Text();
  }

  draw() {
    const container = new PIXI.Graphics();
    // now draw the text
    this.text.text = `seeds (${inventory.seeds})`;
    this.text.style = {
      fontFamily : 'Helvetica',
      fontSize: 24,
      fontWeight: 'bold',
      fill : WHITE,
      align : 'center',
    };
    this.text.anchor.set(0.5);
    this.text.x = 32;
    this.text.y = 80;

    const sprite = new PIXI.Sprite(this.texture);
    sprite.x = 0;
    sprite.y = 0;

    container.addChild(this.text);
    container.addChild(sprite);
    container.x = 900;
    container.y = 25;

    return container;
  }
}

class TextBox {
  constructor() {
    this.text = [];
    this.hidden = true;
  }

  async displayText(text) {
    if(!Array.isArray(text)) {
      text = [text];
    }

    this.hidden = false;
    const keyboard = new AsyncKeyboard();
    for (let message of text) {
      this.message = message;
      await keyboard.nextKey();
    }
    this.hidden = true;
  }

  hide() {
    this.hidden = true;
  }

  draw() {
    if (this.hidden) {
      return new PIXI.Graphics();
    }

    const rectangle = new PIXI.Graphics();
    const width = 500;
    const height = 100;

    // draw the outside box
    rectangle.lineStyle(4, 0x093A3E, 1);
    rectangle.beginFill(BROWN);
    rectangle.drawRect(0, 0, width, height);
    rectangle.endFill();
    rectangle.x = 250;
    rectangle.y = 650;

    // now draw the text
    const text = new PIXI.Text(
      this.message, {
        fontFamily : 'Helvetica',
        fontSize: 24,
        fontWeight: 'bold',
        fill : WHITE,
        align : 'center',
      }
    );
    text.anchor.set(0.5);
    text.x = width / 2;
    text.y = height / 2;

    rectangle.addChild(text);

    return rectangle;
  }
}


class O2Meter {
  constructor() {
    this.oxygen = 750;
  }

  draw() {
    const rectangle = new PIXI.Graphics();
    const meterHeight = 64 * 6;
    const oxygenHeight = meterHeight - meterHeight * this.oxygen / MAX_O2;

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
  constructor() {
    this.o2Generation = 0.25;
  }

  get statusMessage() {
    return 'This plant is looking healthy!';
  }

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

    this.movementDelay = 0.1;
    this.moveCode = null;
    this.timeSinceLastMovement = 0;
    this.position = {x: 15 * BLOCK_SIZE, y: 15 * BLOCK_SIZE};
    this.o2Consumption = 5.0;
  }

  update(dt) {
    this.moveCode = this.findMoveCode()

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

  scalarMultiply(v, scale) {
    return {x: v.x * scale, y: v.y * scale};
  }

  clampPosition(position) {
    return {
      x: clamp(position.x, 0, BLOCK_SIZE * (COLUMNS - 1)),
      y: clamp(position.y, 0, BLOCK_SIZE * (ROWS - 1)),
    }
  }

  get gridPosition() {
    return {
      x: this.position.x / BLOCK_SIZE,
      y: this.position.y / BLOCK_SIZE,
    };
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
    this.seedInventory = new SeedInventory();
    this.o2meter = new O2Meter();
    this.textBox = new TextBox();
  }

  update(dt) {
    this.stage.update(dt);
    this.o2meter.oxygen = this.stage.oxygen;
    if (this.stage.statusMessage) {
      this.textBox.displayText(this.stage.statusMessage);
    } else {
      this.textBox.hide();
    }
  }

  draw() {
    const scene = new PIXI.Container();
    scene.addChild(this.stage.draw());
    scene.addChild(this.seedInventory.draw());
    scene.addChild(this.o2meter.draw());
    scene.addChild(this.textBox.draw());
    return scene;
  }
}

class Plants {
  constructor() {
    this.grid = [];
    for (let x = 0; x < COLUMNS; ++x) {
      const row = []
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
    const scene = new PIXI.Container();
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

class Overlay {
  constructor() {
    this.animation = null;
    this.opacity = 0.5;
  }

  draw() {
    const graphics = new PIXI.Graphics();
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

class SceneManager {
  constructor() {
    this.game = new GameScene();
    this.overlay = new Overlay();
    this.textBox = new TextBox();
    this.pauseGame = false;
  }

  update(dt) {
    this.overlay.update(dt);
    if (!this.pauseGame) {
      this.game.update(dt);
    }
  }

  draw() {
    const container = new PIXI.Graphics();
    container.addChild(this.game.draw());
    container.addChild(this.overlay.draw());
    container.addChild(this.textBox.draw());
    return container;
  }

  async start() {
    this.pauseGame = true;
    this.overlay.opacity = 1;
    await this.textBox.displayText(INTRO_TEXT);
    await this.overlay.fadeIn(8);
    this.pauseGame = false;
  }
}

class Stage {
  constructor() {
    this.columns = 32;
    this.rows = 24;
    this.plants = new Plants();
    this.character = new Character();
    this.oxygen = 750;
    this.statusMessage = '';
    mainEventQueue.listen('keydown', this.onKeyDown.bind(this));
  }

  get width() {
    return BLOCK_SIZE * this.columns;
  }

  get height() {
    return BLOCK_SIZE * this.rows;
  }

  update(dt) {
    this.character.update(dt);
    const d02 = dt * (this.plants.o2GenerationRate() - this.character.o2Consumption);
    this.oxygen = clamp(this.oxygen + d02, 0, MAX_O2);

    // if the player is on a plant, let's report on the plant's status
    const playerPosition = this.character.gridPosition;
    if (this.plants.hasPlant(playerPosition)) {
      this.statusMessage = this.plants.plantStatus(playerPosition);
    } else if (this.postedMessage) {
      this.statusMessage = this.postedMessage;
    } else {
      this.statusMessage = '';
    }
  }

  onKeyDown(keyCode) {
    this.postedMessage = '';

    if (keyCode === 'KeyA') {
      if (inventory.seeds > 0) {
        if (!this.plants.hasPlant(this.character.gridPosition)) {
          this.plants.addPlant(this.character.gridPosition);
          inventory.seeds--;
        }
      } else {
        this.postMessage('No more seeds left.');
      }
    }
  }

  postMessage(message) {
    this.postedMessage = message;
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
  constructor(disableIntro=true) {
    this.renderer = new PIXI.WebGLRenderer(1024, 768);
    this.gameScene = new SceneManager();
    this.gameScene.start();
  }

  update(dt) {
    mainEventQueue.executeQueue();
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
      const dt = Math.max(0, ntime - time);
      time = ntime;
      cb(dt / 1000);
      requestAnimationFrame(animationFrameCB);
    }
    requestAnimationFrame(animationFrameCB);
  }
}

(new GameRunner).run();