import { Container, Sprite, Text, Texture } from 'pixi';

import { WHITE } from 'constants';

const SEED_TEXTURE = Texture.fromImage('seeds.png');

export class SeedInventory {
  constructor() {
    this.initializeGraphics();
    this.seeds = 5;
  }

  initializeGraphics() {
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

    const sprite = new Sprite(SEED_TEXTURE);

    this.scene = new Container();
    this.scene.addChild(sprite);
    this.scene.addChild(this.text);
    this.scene.x = 900;
    this.scene.y = 25;
  }

  draw() {
    this.text.text = `seeds (${this.seeds})`;
  }

  get display() {
    return this.scene;
  }
}
