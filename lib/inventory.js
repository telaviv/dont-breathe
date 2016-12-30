import { Container, Sprite, Text, Texture } from 'pixi';

import { WHITE } from 'constants';

const SEED_TEXTURE = Texture.fromImage('seeds.png');
const FRUIT_TEXTURE = Texture.fromImage('fruit.png');

class Inventory {
  constructor(prop, count, texture) {
    this.initializeGraphics(texture);
    this.prop = prop;
    this.count = count;
  }

  initializeGraphics(texture) {
    this.text = new Text();
    this.text.style = {
      fontFamily: 'Helvetica',
      fontSize: 24,
      fontWeight: 'bold',
      fill: WHITE,
      align: 'center',
    };
    this.text.anchor.set(0.5);
    this.text.x = 32;
    this.text.y = 80;

    const sprite = new Sprite(texture);

    this.scene = new Container();
    this.scene.addChild(sprite);
    this.scene.addChild(this.text);
  }

  draw() {
    this.text.text = `${this.prop} (${this.count})`;
  }

  get display() {
    return this.scene;
  }
}

export class SeedInventory extends Inventory {

  constructor() {
    super('seeds', 5, SEED_TEXTURE);
  }

  get seeds() {
    return this.count;
  }

  set seeds(value) {
    this.count = value;
  }
}

export class FruitInventory extends Inventory {

  constructor() {
    super('fruit', 0, FRUIT_TEXTURE);
  }

  get fruit() {
    return this.count;
  }

  set fruit(value) {
    this.count = value;
  }
}
