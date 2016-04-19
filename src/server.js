import MethodsManager from './methods';

const serializeError = error => ({
  name: error.name,
  message: error.message,
  ...error
});

export default class Server {
  constructor() {
    this.emitters = [];
    this.methods = new MethodsManager;
  }
  addEmitter(emitter) {
    if (this.emitters.indexOf(emitter) === -1) {
      emitter.on('call', (id, name, args) => {
        this.onCall(emitter, id, name, args);
      });
      this.emitters.push(emitter);
    }
  }
  onCall(emitter, id, name, args = []) {
    this.methods.callMethod(name, args)
      .then(result => {
        emitter.emit('resolve', id, result);
      })
      .catch(error => {
        emitter.emit('reject', id, serializeError(error));
      });
  }
  method(name, callback) {
    this.methods.registerMethod(name, callback);
  }
}
