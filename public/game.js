const GREEN = 0x73fe00;
const RED = 0xFF3300;
const BLUE = 0x66CCFF;

class O2Meter {
  constructor() {
    this.MAX_O2 = 1000;
    this.DEPLETION_RATE = 5;
    this.currentO2 = this.MAX_O2;
  }

  update(dt) {
    this.currentO2 = Math.max(0, this.currentO2 - this.DEPLETION_RATE * dt);
    console.log('current O2', this.currentO2);
  }

  draw() {
    const rectangle = new PIXI.Graphics();
    const meterHeight = 64 * 6;
    const oxygenHeight = meterHeight - meterHeight * this.currentO2 / this.MAX_O2;

    // draw the outside meter
    rectangle.lineStyle(4, RED, 1);
    rectangle.beginFill(BLUE);
    rectangle.drawRect(0, 0, 64, meterHeight);
    rectangle.endFill();

    // draw the oxygen inside the meter
    rectangle.beginFill(RED);
    rectangle.drawRect(0, 0, 64, oxygenHeight);
    rectangle.endFill();

    return rectangle;
  }
}

class Plant {
  draw() {
    const graphics = new PIXI.Graphics();
    graphics.lineStyle(4, GREEN, 1);
    graphics.drawRect(15, 15, 1, 20);
    graphics.drawRect(15, 21, 5, 1);
    graphics.drawRect(7, 15, 8, 1);
    return graphics;
  }
}

class GameScene {
  constructor() {
    this.o2meter = new O2Meter();
    this.plant = new Plant();
  }

  update(dt) {
    this.o2meter.update(dt);
  }

  draw() {
    const stage = new PIXI.Container();
    const o2sprite = this.o2meter.draw();
    o2sprite.x = 100;
    o2sprite.y = 100;
    const plantSprite = this.plant.draw();
    plantSprite.x = 300;
    plantSprite.y = 300;

    stage.addChild(o2sprite);
    stage.addChild(plantSprite);
    return stage;
  }
}

class GameRunner {
  constructor() {
    this.gameScene = new GameScene();
    this.renderer = PIXI.autoDetectRenderer(1024, 768);
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
      const dt = ntime - time;
      time = ntime;
      cb(dt / 1000);
      requestAnimationFrame(animationFrameCB);
    }
    requestAnimationFrame(animationFrameCB);
  }
}


(new GameRunner).run()
