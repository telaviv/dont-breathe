export class EventQueue {
  constructor() {
    this.listeners = {};
    this.queue = [];
  }

  listen(eventType, cb) {
    if (this.listeners[eventType] !== undefined) {
      this.listeners[eventType].push(cb);
    } else {
      this.listeners[eventType] = [cb];
    }
  }

  enqueue(eventType, data) {
    if (this.listeners[eventType] === undefined) {
      return;
    }

    for (let cb of this.listeners[eventType]) {
      this.queue.push(() => cb(data));
    }
  }

  executeQueue() {
    for (let thunk of this.queue) {
      thunk();
    }
    this.queue = [];
  }

  clearQueue() {
    this.queue = [];
  }
}

export class AsyncEventQueue {
  constructor() {
    this.listeners = {};
  }

  trigger(eventType, data) {
    const leftoverListeners = [];
    for (let listener of this.listeners[eventType] || []) {
      const { matcher, resolve } = listener;
      if (matcher(data)) {
        resolve();
      } else {
        leftoverListeners.push(listener);
      }
    }
    this.listeners[eventType] = leftoverListeners;
  }

  nextEvent(eventType, matcher=() => true) {
    if (this.listeners[eventType] === undefined) {
      this.listeners[eventType] = [];
    }
    return new Promise((resolve) => {
      this.listeners[eventType].push({ matcher, resolve });
    });
  }
}
