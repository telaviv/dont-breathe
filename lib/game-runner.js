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
    const scene = this.gameScene.draw();
    this.renderer.render(scene);
    scene.destroy({children: true});
  }

  run() {
    document.body.appendChild(this.renderer.view);

    const renderClock = new RenderClock();
    renderClock.run(this.update.bind(this));
  }
}
