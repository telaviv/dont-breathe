import { Container, Sprite, Text, Texture } from 'pixi';

import { WHITE } from 'constants';

export class SeedInventory {
  constructor() {
    this.seeds = 5;
    this.texture = Texture.fromImage('seeds.png');
    this.text = new Text();
  }

  draw() {
    const container = new Container();
    // now draw the text
    this.text.text = `seeds (${this.seeds})`;
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

    const sprite = new Sprite(this.texture);
    sprite.x = 0;
    sprite.y = 0;

    container.addChild(this.text);
    container.addChild(sprite);
    container.x = 900;
    container.y = 25;

    return container;
  }
}
