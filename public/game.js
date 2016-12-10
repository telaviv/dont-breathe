class O2Meter {
  draw() {
    var rectangle = new PIXI.Graphics();
    rectangle.lineStyle(4, 0xFF3300, 1);
    rectangle.beginFill(0x66CCFF);
    rectangle.drawRect(0, 0, 64, 64 * 6);
    rectangle.endFill();
    return rectangle;
  }
}

//Create the renderer
var renderer = PIXI.autoDetectRenderer(1024, 768);

//Add the canvas to the HTML document
document.body.appendChild(renderer.view);

//Create a container object called the `stage`
var stage = new PIXI.Container();
var o2Meter = (new O2Meter()).draw();
o2Meter.x = 170;
o2Meter.y = 170;
stage.addChild(o2Meter);

var message = new PIXI.Text(
  "Hello Pixi!",
  {font: "32px sans-serif", fill: "white"}
);

message.position.set(54, 96);
stage.addChild(message);

//Tell the `renderer` to `render` the `stage`
renderer.render(stage);
