import * as PIXI from 'pixi';

import SceneManager from 'scene-manager';

class GameRunner {
  constructor() {
    this.renderer = new PIXI.WebGLRenderer(1024, 768);
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

class RenderClock {

  run(cb) {
    let time = performance.now();

    const animationFrameCB = (ntime) => {
      const dt = Math.max(0, ntime - time);
      time = ntime;
      cb(dt / 1000);
      requestAnimationFrame(animationFrameCB);
    };
    requestAnimationFrame(animationFrameCB);
  }
}

(new GameRunner).run();
