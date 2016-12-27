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
    const text = new Text(`seeds (${this.seeds})`, {
      fontFamily: 'Helvetica',
      fontSize: 24,
      fontWeight: 'bold',
      fill: WHITE,
      align: 'center',
    });
    text.anchor.set(0.5);
    text.x = 32;
    text.y = 80;

    const sprite = new Sprite(this.texture);
    sprite.x = 0;
    sprite.y = 0;

    container.addChild(text);
    container.addChild(sprite);
    container.x = 900;
    container.y = 25;

    return container;
  }
}
