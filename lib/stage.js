import { Graphics, Container } from 'pixi';

import Character from 'character';
import { BLOCK_SIZE, MAX_O2 } from 'constants';
import { AsyncEventQueue } from 'events';
import Plants from 'plants';
import { clamp } from 'utilities';

export default class Stage extends AsyncEventQueue {
  constructor(keyboard) {
    super();

    this.columns = 32;
    this.rows = 24;
    this.plants = new Plants();
    this.oxygen = 750;
    this.statusMessage = '';
    this.keyboard = keyboard;
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
  }

  onKeyDown(keyCode) {
    this.postedMessage = '';

    if (keyCode === 'KeyA') {
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
    const stage = new Container();
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
