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
    rectangle.lineStyle(4, 0xFF3300, 1);
    rectangle.beginFill(0x66CCFF);
    rectangle.drawRect(0, 0, 64, meterHeight);
    rectangle.endFill();

    // draw the oxygen inside the meter
    rectangle.beginFill(0xFF3300);
    rectangle.drawRect(0, 0, 64, oxygenHeight);
    rectangle.endFill();

    return rectangle;
  }
}

class GameScene {
  constructor() {
    this.o2meter = new O2Meter();
  }

  update(dt) {
    this.o2meter.update(dt);
  }

  draw() {
    const stage = new PIXI.Container();
    const o2sprite = this.o2meter.draw();
    o2sprite.x = 100;
    o2sprite.y = 100;
    stage.addChild(o2sprite);
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
