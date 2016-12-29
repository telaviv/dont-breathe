import { Container } from 'pixi';

import O2Meter from 'o2meter';
import { SeedInventory } from 'inventory';
import { AsyncKeyboard, Keyboard } from 'keyboard';
import Stage from 'stage';
import TextBox from 'text-box';

export default class GameScene {
  constructor() {
    this.keyboard = new Keyboard();
    this.asyncKeyboard = new AsyncKeyboard();
    this.stage = new Stage(this.keyboard);
    this.seedInventory = new SeedInventory();
    this.o2meter = new O2Meter();
    this.textBox = new TextBox(this.asyncKeyboard);
    this.paused = false;
    this.display = new Container();
  }

  update(dt) {
    if (this.paused) {
      return;
    }

    this.keyboard.executeQueue();
    this.stage.update(dt);

    const { oxygen, seeds } = this.stage.uiStats();
    this.o2meter.oxygen = oxygen;
    this.seedInventory.seeds = seeds;
  }

  pause() {
    this.paused = true;
    this.asyncKeyboard.pause();
  }

  unpause() {
    this.paused = false;
    this.keyboard.clearQueue();
    this.asyncKeyboard.unpause();
  }

  draw() {
    this.display.removeChildren();
    this.stage.draw();
    this.o2meter.draw();
    this.seedInventory.draw();

    this.display.addChild(this.stage.display);
    this.display.addChild(this.o2meter.display);
    this.display.addChild(this.seedInventory.display);

    if (this.stage.statusMessage) {
      this.textBox.displayText(this.stage.statusMessage);
      this.textBox.draw();
      this.display.addChild(this.textBox.display);
    }
    return this.display;
  }
}
