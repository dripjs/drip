import Crypto from 'crypto';

const uniqueId = (length = 10) => (
  Crypto.randomBytes(length).toString('base64')
);

const deserializeError = object => (
  Object.assign(new Error, object)
);

export default class Client {
  constructor(emitter) {
    this.calls = [];
    this.emitter = emitter;
  }
  setEmitter(emitter) {
    emitter.on('resolve', (id, result) => {
      this.onResolve(id, result);
    });
    emitter.on('reject', (id, error) => {
      this.onReject(id, error);
    });
    this.emitter = emitter;
  }
  call(name, ...args) {
    return new Promise((resolve, reject) => {
      const id = uniqueId(10);
      this.calls[id] = { resolve, reject };
      this.emitter.emit('call', id, name, args);
    });
  }
  onResolve(id, result) {
    this.calls[id].resolve(result);
    delete this.calls[id];
  }
  onReject(id, error) {
    this.calls[id].reject(deserializeError(error));
    delete this.calls[id];
  }
}
