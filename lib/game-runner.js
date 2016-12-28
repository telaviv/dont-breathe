import RenderClock from 'render-clock';
import SceneManager from 'scene-manager';

import { renderer } from 'graphics';

export default class GameRunner {
  constructor() {
    this.gameScene = new SceneManager();
    this.gameScene.start();
  }

  update(dt) {
    this.gameScene.update(dt);
    const scene = this.gameScene.draw();
    renderer.render(scene);
  }

  run() {
    document.body.appendChild(renderer.view);

    const renderClock = new RenderClock();
    renderClock.run(this.update.bind(this));
  }
}
