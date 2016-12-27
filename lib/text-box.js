import { Graphics, Text } from 'pixi';

import { WHITE, BROWN } from 'constants';
import { AsyncKeyboard } from 'keyboard';

export default class TextBox {
  constructor() {
    this.text = [];
    this.hidden = true;
  }

  async displayText(text) {
    if(!Array.isArray(text)) {
      text = [text];
    }

    this.hidden = false;
    const keyboard = new AsyncKeyboard();
    for (let message of text) {
      this.message = message;
      await keyboard.nextKey();
    }
    this.message = '';
    this.hidden = true;
  }

  hide() {
    this.hidden = true;
  }

  draw() {
    if (this.hidden) {
      return new Graphics();
    }

    const rectangle = new Graphics();
    const width = 500;
    const height = 100;

    // draw the outside box
    rectangle.lineStyle(4, 0x093A3E, 1);
    rectangle.beginFill(BROWN);
    rectangle.drawRect(0, 0, width, height);
    rectangle.endFill();
    rectangle.x = 250;
    rectangle.y = 650;

    // now draw the text
    const text = new Text(
      this.message, {
        fontFamily : 'Helvetica',
        fontSize: 24,
        fontWeight: 'bold',
        fill : WHITE,
        align : 'center',
      }
    );
    text.anchor.set(0.5);
    text.x = width / 2;
    text.y = height / 2;

    rectangle.addChild(text);

    return rectangle;
  }
}
