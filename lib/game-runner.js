import { WebGLRenderer } from 'pixi';

import { SCREEN_WIDTH, SCREEN_HEIGHT } from 'constants';
import RenderClock from 'render-clock';
import SceneManager from 'scene-manager';

export default class GameRunner {
  constructor() {
    this.renderer = new WebGLRenderer(SCREEN_WIDTH, SCREEN_HEIGHT);
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
