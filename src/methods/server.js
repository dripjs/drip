const serializeError = error => ({
  name: error.name,
  message: error.message,
  ...error
});

export default class Server {
  constructor() {
    this.emitters = [];
    this.methods = [];
  }
  addEmitter(emitter) {
    if (this.emitters.indexOf(emitter) === -1) {
      emitter.on('call', (id, name, args) => {
        this.onCall(emitter, id, name, args);
      });
      this.emitters.push(emitter);
    }
  }
  registerMethod(name, callback) {
    if (this.methods[name] !== undefined) {
      throw new Error('this method already exists');
    }
    this.methods[name] = callback;
  }
  onCall(emitter, id, name, args = []) {
    Promise.resolve()
      .then(() => {
        if (this.methods[name] === undefined) {
          const error = new Error('method does not exist');
          error.name = 'MethodNotFound';
          throw error;
        }
        return this.methods[name](...args);
      })
      .then(result => {
        emitter.emit('resolve', id, result);
      })
      .catch(error => {
        emitter.emit('reject', id, serializeError(error));
      });
  }
}
