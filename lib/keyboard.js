import { EventQueue } from 'events';

export class Keyboard extends EventQueue {
  constructor(eventQueue) {
    super();

    this.keys = new Set([]);
    this.eventQueue = eventQueue;
    addEventListener('keydown', this.onDown.bind(this));
    addEventListener('keyup', this.onUp.bind(this));
  }

  onDown(event) {
    this.keys.add(event.code);
    this.enqueue('keydown', event.code);
  }

  onUp(event) {
    this.keys.delete(event.code);
  }
}

export class AsyncKeyboard {

  constructor() {
    this.listening = false;
    this.paused = false;
    addEventListener('keydown', this.onKeyDown.bind(this));
  }

  pause() {
    this.paused = true;
  }

  unpause() {
    this.paused = false;
  }

  nextKey() {
    this.listening = true;
    return new Promise((resolve) => {
      this.resolve = resolve;
    });
  }

  onKeyDown(event) {
    if (this.listening && !this.paused) {
      this.listening = false;
      this.resolve(event.code);
    }
  }
}
