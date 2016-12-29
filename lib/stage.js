import { Container, Graphics, Sprite } from 'pixi';

import Character from 'character';
import { BLOCK_SIZE, COLUMNS, ROWS, MAX_O2 } from 'constants';
import { AsyncEventQueue } from 'events';
import { renderer } from 'graphics';
import Plants from 'plants';
import { clamp } from 'utilities';

const createBackgroundTexture = function() {
  const graphics = new Graphics();
  graphics.beginFill(0x7E6B8F);
  graphics.drawRect(0, 0, BLOCK_SIZE * COLUMNS, BLOCK_SIZE * ROWS);
  graphics.endFill();

  const texture = renderer.generateTexture(graphics);
  graphics.destroy();
  return texture;
};

const BACKGROUND_TEXTURE = createBackgroundTexture();

export default class Stage extends AsyncEventQueue {
  constructor(keyboard) {
    super();

    this.oxygen = 750;
    this.statusMessage = '';
    this.keyboard = keyboard;
    this.keyboard.listen('keydown', this.onKeyDown.bind(this));
    this.plants = new Plants();
    this.character = new Character(this.keyboard);
    this.scene = new Container();
    this.scene.addChild(new Sprite(BACKGROUND_TEXTURE));
    this.scene.addChild(this.plants.draw());
    this.scene.addChild(this.character.display);

    // remove this.
    this.scene.x = 500 - this.character.position.x;
    this.scene.y = 350 - this.character.position.y;
  }

  get width() {
    return BLOCK_SIZE * COLUMNS;
  }

  get height() {
    return BLOCK_SIZE * ROWS;
  }

  update(dt) {
    this.character.update(dt);
    const d02 = dt * (this.plants.o2GenerationRate() - this.character.o2Consumption);
    this.oxygen = clamp(this.oxygen + d02, 0, MAX_O2);

    // if the player is on a plant, let's report on the plant's status
    const playerPosition = this.character.gridPosition;
    if (this.postedMessage) {
      this.statusMessage = this.postedMessage;
    } else if (this.plants.hasPlant(playerPosition)) {
      this.statusMessage = this.plants.plantStatus(playerPosition);
    } else {
      this.statusMessage = '';
    }

    // remove this.
    this.scene.x = 500 - this.character.position.x;
    this.scene.y = 350 - this.character.position.y;
  }

  onKeyDown(keyCode) {
    this.postedMessage = '';

    if (keyCode === 'KeyA') {
      this.plantSeed();
    } if (keyCode === 'KeyF') {
      this.harvestPlant();
    }
  }

  harvestPlant() {
    const pos = this.character.gridPosition;
    if (this.plants.canHarvest(pos)) {
      const inventory = this.plants.harvest(pos);
      this.character.updateInventory(inventory);
    }
  }

  plantSeed() {
    if (this.character.inventory.seeds !== 0) {
      this.trigger('seed-used');
    }

    if (this.character.inventory.seeds > 0) {
      if (!this.plants.hasPlant(this.character.gridPosition)) {
        this.plants.addPlant(this.character.gridPosition);
        this.character.inventory.seeds--;
        if (this.character.inventory.seeds === 0) {
          this.trigger('seeds-emptied');
        }
      }
    } else {
      this.postMessage('No more seeds left.');
    }
  }

  postMessage(message) {
    this.postedMessage = message;
  }

  hideMessage() {
    this.postedMessage = '';
  }

  uiStats() {
    return {
      oxygen: this.oxygen,
      seeds: this.character.inventory.seeds,
    };
  }

  drawBackground() {
    const graphics = new Graphics();
    graphics.beginFill(0x7E6B8F);
    graphics.drawRect(0, 0, this.width, this.height);
    graphics.endFill();
    return graphics;
  }

  draw() {
    this.character.draw();
    this.plants.draw();
    return this.scene;
  }
}
