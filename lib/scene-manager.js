import { Container } from 'pixi';

import {
  INTRO_TEXT,
  SCREEN_WIDTH, SCREEN_HEIGHT,
} from 'constants';
import { MODAL_QUEUE } from 'events';
import GameScene from 'game-scene';
import { AsyncKeyboard } from 'keyboard';
import Overlay from 'overlay';
import TextBox from 'text-box';


export default class SceneManager {
  constructor() {
    this.game = new GameScene();
    this.overlay = new Overlay();
    this.textBox = new TextBox(new AsyncKeyboard());
    this.showTextBox = false;
    this.pauseGame = false;
    this.skipIntro = true;
    this.container = new Container();

    MODAL_QUEUE.setListener(this.onModalEvent.bind(this));
  }

  async onModalEvent(message) {
    return await this.showModal(message);
  }

  update(dt) {
    this.overlay.update(dt);
    this.game.update(dt);
  }

  async start() {
    if (this.skipIntro) {
      this.overlay.opacity = 0;
    } else {
      await this.showIntro();
    }

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

  async showIntro() {
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

  center(display) {
    const { width, height } = display.getLocalBounds();
    display.x = (SCREEN_WIDTH - width) / 2;
    display.y = (SCREEN_HEIGHT - height) / 2;
  }

  draw() {
    this.container.removeChildren();
    this.game.draw();
    this.overlay.draw();
    this.container.addChild(this.game.display);
    this.container.addChild(this.overlay.display);

    if (this.showTextBox) {
      this.textBox.draw();
      this.center(this.textBox.display);
      this.container.addChild(this.textBox.display);
    }
    return this.container;
  }

  get display() {
    return this.container;
  }
}
