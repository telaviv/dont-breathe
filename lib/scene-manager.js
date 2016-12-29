import { Container } from 'pixi';

import {
  INTRO_TEXT,
  SCREEN_WIDTH, SCREEN_HEIGHT,
  TEXTBOX_WIDTH, TEXTBOX_HEIGHT,
} from 'constants';
import GameScene from 'game-scene';
import { AsyncKeyboard } from 'keyboard';
import Overlay from 'overlay';
import TextBox from 'text-box';


export default class SceneManager {
  constructor() {
    this.game = new GameScene();
    this.overlay = new Overlay();
    this.textBox = this.createCenteredTextBox();
    this.showTextBox = false;
    this.pauseGame = false;
    this.container = new Container();
  }

  createCenteredTextBox() {
    const textBox = new TextBox(new AsyncKeyboard());
    textBox.display.x = (SCREEN_WIDTH - TEXTBOX_WIDTH) / 2;
    textBox.display.y = (SCREEN_HEIGHT - TEXTBOX_HEIGHT) / 2;
    return textBox;
  }

  update(dt) {
    this.overlay.update(dt);
    this.game.update(dt);
  }

  drawCenteredTextBox() {
    const textBox = this.textBox.draw();
    textBox.x = (SCREEN_WIDTH - TEXTBOX_WIDTH) / 2;
    textBox.y = (SCREEN_HEIGHT - TEXTBOX_HEIGHT) / 2;
    return textBox;
  }

  draw() {
    this.textBox.draw();
    this.container.removeChildren();
    this.container.addChild(this.game.draw());
    this.container.addChild(this.overlay.draw());

    if (this.showTextBox) {
      this.textBox.draw();
      this.container.addChild(this.textBox.display);
    }
    return this.container;
  }

  async start() {
    // Show intro text and fade in.
    this.game.pause();
    this.overlay.opacity = 1;
    await this.displayTextBox(INTRO_TEXT);
    await this.overlay.animateTo(0, 5);
    this.game.unpause();

    // Explain seed planting
    this.game.stage.postMessage('[ Press \'A\' to plant a seed ]');
    await this.game.stage.nextEvent('seed-used');

    this.showModal([
      'Plants have the ability to raise oxygen',
      'Let\'s plant the rest of our seeds',
      'Hopefully that will at least slow down ...',
      'our suffocation',
    ]);

    // After all the seeds are done make all the plants harvestable.
    await this.game.stage.nextEvent('seeds-emptied');
    this.game.stage.plants.fruitPlants();
    this.showModal([
      'Looks like we\'re out of seeds',
      'we can get new seeds ...',
      'by harvesting plants when they are ready',
    ]);
    this.game.stage.postMessage('[ Press \'F\' to harvest a plant ]');
  }

  async displayTextBox(text) {
    this.showTextBox = true;
    await this.textBox.displayText(text);
    this.showTextBox = false;
  }

  async showModal(text) {
    this.game.pause();
    await this.overlay.animateTo(0.5, 0.5);
    await this.displayTextBox(text);
    await this.overlay.animateTo(0, 0.5);
    this.game.unpause();
  }
}
