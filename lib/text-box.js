import { Graphics, Text } from 'pixi';

import {
  WHITE, BROWN,
  SCREEN_WIDTH,
  TEXTBOX_HEIGHT, TEXTBOX_WIDTH } from 'constants';

export default class TextBox {
  constructor(asyncKeyboard) {
    this.text = [];
    this.hidden = true;
    this.keyboard = asyncKeyboard;
    this.graphics = new Graphics();
    this.text = new Text();
    this.graphics.addChild(this.text);
  }

  async displayText(text) {
    if(!Array.isArray(text)) {
      text = [text];
    }

    this.hidden = false;
    for (let message of text) {
      this.message = message;
      await this.keyboard.nextKey();
    }
    this.message = '';
    this.hide();
  }

  hide() {
    this.hidden = true;
  }

  draw() {
    this.graphics.clear();
    if (this.hidden) {
      this.text.text = '';
      return this.graphics;
    }

    const rectangle = this.graphics;
    const width = TEXTBOX_WIDTH;
    const height = TEXTBOX_HEIGHT;

    // draw the outside box
    rectangle.lineStyle(4, 0x093A3E, 1);
    rectangle.beginFill(BROWN);
    rectangle.drawRect(0, 0, width, height);
    rectangle.endFill();
    rectangle.x = (SCREEN_WIDTH - width) / 2;
    rectangle.y = 650;

    this.text.text = this.message;
    this.text.style = {
      fontFamily: 'Helvetica',
      fontSize: 24,
      fontWeight: 'bold',
      fill: WHITE,
      align: 'center',
    };
    this.text.anchor.set(0.5);
    this.text.x = width / 2;
    this.text.y = height / 2;

    return rectangle;
  }
}
