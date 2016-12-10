//Create the renderer
var renderer = PIXI.autoDetectRenderer(1024, 768);

//Add the canvas to the HTML document
document.body.appendChild(renderer.view);

//Create a container object called the `stage`
var stage = new PIXI.Container();

var rectangle = new PIXI.Graphics();
rectangle.lineStyle(4, 0xFF3300, 1);
rectangle.beginFill(0x66CCFF);
rectangle.drawRect(0, 0, 64, 64);
rectangle.endFill();
rectangle.x = 170;
rectangle.y = 170;
stage.addChild(rectangle);

var message = new PIXI.Text(
  "Hello Pixi!",
  {font: "32px sans-serif", fill: "white"}
);

message.position.set(54, 96);
stage.addChild(message);

//Tell the `renderer` to `render` the `stage`
renderer.render(stage);
