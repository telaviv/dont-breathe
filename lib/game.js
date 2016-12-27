import * as PIXI from 'pixi';

import O2Meter from 'o2meter';
import Overlay from 'overlay';
import Stage from 'stage';
import TextBox from 'textBox';

import {
  WHITE,
  INTRO_TEXT,
} from 'constants';

class SeedInventory {
  constructor() {
    this.seeds = 5;
    this.texture = PIXI.Texture.fromImage('seeds.png');
    this.text = new PIXI.Text();
  }

  draw() {
    const container = new PIXI.Graphics();
    // now draw the text
    this.text.text = `seeds (${this.seeds})`;
    this.text.style = {
      fontFamily : 'Helvetica',
      fontSize: 24,
      fontWeight: 'bold',
      fill : WHITE,
      align : 'center',
    };
    this.text.anchor.set(0.5);
    this.text.x = 32;
    this.text.y = 80;

    const sprite = new PIXI.Sprite(this.texture);
    sprite.x = 0;
    sprite.y = 0;

    container.addChild(this.text);
    container.addChild(sprite);
    container.x = 900;
    container.y = 25;

    return container;
  }
}

class GameScene {
  constructor() {
    this.stage = new Stage();
    this.seedInventory = new SeedInventory();
    this.o2meter = new O2Meter();
    this.textBox = new TextBox();
  }

  update(dt) {
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

  draw() {
    const scene = new PIXI.Container();
    scene.addChild(this.stage.draw());
    scene.addChild(this.seedInventory.draw());
    scene.addChild(this.o2meter.draw());
    scene.addChild(this.textBox.draw());
    return scene;
  }
}

class SceneManager {
  constructor() {
    this.game = new GameScene();
    this.overlay = new Overlay();
    this.textBox = new TextBox();
    this.pauseGame = false;
  }

  update(dt) {
    this.overlay.update(dt);
    if (!this.pauseGame) {
      this.game.update(dt);
    }
  }

  draw() {
    const container = new PIXI.Graphics();
    container.addChild(this.game.draw());
    container.addChild(this.overlay.draw());
    container.addChild(this.textBox.draw());
    return container;
  }

  async start() {
    this.pauseGame = true;
    this.overlay.opacity = 1;
    await this.textBox.displayText(INTRO_TEXT);
    await this.overlay.fadeIn(8);
    this.pauseGame = false;
  }
}

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
