import { Graphics, Text } from 'pixi';

import {
  WHITE, BROWN,
  SCREEN_WIDTH,
  TEXTBOX_HEIGHT, TEXTBOX_WIDTH } from 'constants';

export default class TextBox {
  constructor(asyncKeyboard) {
    this.text = [];
    this.keyboard = asyncKeyboard;
    this.initializeDisplay();
  }

  async displayText(text) {
    if(!Array.isArray(text)) {
      text = [text];
    }

    for (let message of text) {
      this.message = message;
      await this.keyboard.nextKey();
    }
    this.message = '';
  }

  draw() {
    this.text.text = this.message;
  }

  // Drawing

  initializeDisplay() {
    this.background = this.createBackground();
    this.text = this.createText();
    this.background.addChild(this.text);
  }

  createBackground() {
    const rectangle = new Graphics();
    const width = TEXTBOX_WIDTH;
    const height = TEXTBOX_HEIGHT;

    // draw the outside box
    rectangle.lineStyle(4, 0x093A3E, 1);
    rectangle.beginFill(BROWN);
    rectangle.drawRect(0, 0, width, height);
    rectangle.endFill();
    rectangle.x = (SCREEN_WIDTH - width) / 2;
    rectangle.y = 650;

    return rectangle;
  }

  createText() {
    const text = new Text(this.message, {
      fontFamily: 'Helvetica',
      fontSize: 24,
      fontWeight: 'bold',
      fill: WHITE,
      align: 'center',
    });
    text.anchor.set(0.5);
    text.x = TEXTBOX_WIDTH / 2;
    text.y = TEXTBOX_HEIGHT / 2;

    return text;
  }

  get display() {
    return this.background;
  }
}
