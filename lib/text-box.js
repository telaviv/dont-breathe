import { Graphics, Text } from 'pixi';

import {
  WHITE, BROWN,
  SCREEN_WIDTH,
  TEXTBOX_HEIGHT, TEXTBOX_WIDTH } from 'constants';

export default class TextBox {
  constructor(asyncKeyboard, height=TEXTBOX_HEIGHT, width=TEXTBOX_WIDTH) {
    this.text = [];
    this.keyboard = asyncKeyboard;
    this.width = width;
    this.height = height;
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

    this.background.clear();
    this.background.lineStyle(4, 0x093A3E, 1);
    this.background.beginFill(BROWN);
    this.background.drawRect(0, 0, this.width, this.height);
    this.background.endFill();
    this.background.x = (SCREEN_WIDTH - this.width) / 2;
  }

  // Drawing

  initializeDisplay() {
    this.background = new Graphics();
    this.text = this.createText();
    this.background.addChild(this.text);
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
