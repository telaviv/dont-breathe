import { Container } from 'pixi';

import { INTRO_TEXT } from 'constants';
import GameScene from 'game-scene';
import Overlay from 'overlay';
import TextBox from 'text-box';

export default class SceneManager {
  constructor() {
    this.game = new GameScene();
    this.overlay = new Overlay();
    this.textBox = new TextBox();
    this.pauseGame = false;
  }

  update(dt) {
    this.overlay.update(dt);
    this.game.update(dt);
  }

  draw() {
    const container = new Container();
    container.addChild(this.game.draw());
    container.addChild(this.overlay.draw());
    container.addChild(this.textBox.draw());
    return container;
  }

  async start() {
    // Show intro text and fade in.
    this.game.pause();
    this.overlay.opacity = 1;
    await this.textBox.displayText(INTRO_TEXT);
    await this.overlay.fadeIn(8);
    this.game.unpause();

    // After all the seeds are done make all the plants harvestable.
    await this.game.stage.nextEvent('seeds-emptied');
    console.log('did it!');
  }
}