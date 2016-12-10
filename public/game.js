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
    o2sprite.x = 170;
    o2sprite.y = 170;
    stage.addChild(o2sprite);
    return stage;
  }
}



//Create the renderer
var renderer = PIXI.autoDetectRenderer(1024, 768);

//Add the canvas to the HTML document
document.body.appendChild(renderer.view);

//Tell the `renderer` to `render` the `stage`
renderer.render((new GameScene).draw());
