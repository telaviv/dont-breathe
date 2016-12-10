class O2Meter {
  draw() {
    const rectangle = new PIXI.Graphics();
    rectangle.lineStyle(4, 0xFF3300, 1);
    rectangle.beginFill(0x66CCFF);
    rectangle.drawRect(0, 0, 64, 64 * 6);
    rectangle.endFill();
    return rectangle;
  }
}

class GameScene {
  constructor() {
    this.o2meter = new O2Meter();
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

  run() {
    document.body.appendChild(this.renderer.view);
    this.renderer.render(this.gameScene.draw());
  }
}


(new GameRunner).run()
