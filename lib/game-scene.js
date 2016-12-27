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

    if (this.stage.statusMessage) {
      this.textBox.displayText(this.stage.statusMessage);
    } else {
      this.textBox.hide();
    }
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
    const scene = new Container();
    scene.addChild(this.stage.draw());
    scene.addChild(this.seedInventory.draw());
    scene.addChild(this.o2meter.draw());
    scene.addChild(this.textBox.draw());
    return scene;
  }
}
