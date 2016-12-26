import * as PIXI from 'pixi';

import { AsyncKeyboard, Keyboard } from 'keyboard';
import O2Meter from 'o2meter';
import Overlay from 'overlay';
import Plants from 'plants';
import { clamp } from 'utilities';

import {
  RED,
  BROWN,
  WHITE,
  BLACK,
  BLOCK_SIZE,
  COLUMNS,
  ROWS,
  MAX_O2,
  INTRO_TEXT,
} from 'constants';


const inventory = {
  seeds: 5,
};

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


class Character {
  constructor(keyboard) {
    this.keyDirections = {
      'ArrowUp': {x: 0, y: -1},
      'ArrowDown': {x: 0, y: 1},
      'ArrowLeft': {x: -1, y: 0},
      'ArrowRight': {x: 1, y: 0},
    };
    this.keyboard = keyboard;
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
    this.oxygen = 750;
    this.statusMessage = '';
    this.keyboard = new Keyboard();
    this.keyboard.listen('keydown', this.onKeyDown.bind(this));
    this.character = new Character(this.keyboard);
  }

  get width() {
    return BLOCK_SIZE * this.columns;
  }

  get height() {
    return BLOCK_SIZE * this.rows;
  }

  update(dt) {
    this.keyboard.executeQueue();
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
  constructor() {
    this.renderer = new PIXI.WebGLRenderer(1024, 768);
    this.gameScene = new SceneManager();
    this.gameScene.start();
  }

  update(dt) {
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
    };
    requestAnimationFrame(animationFrameCB);
  }
}

(new GameRunner).run();
