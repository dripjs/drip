export default class MethodsManager {
  constructor() {
    this.methods = [];
  }
  registerMethod(name, callback) {
    if (this.methods[name] !== undefined) {
      throw new Error('this method already exists');
    }
    this.methods[name] = callback;
  }
  callMethod(name, args = []) {
    return Promise.resolve().then(() => {
      if (this.methods[name] === undefined) {
        const error = new Error('method does not exist');
        error.name = 'MethodNotFound';
        throw error;
      }
      return this.methods[name](...args);
    });
  }
}
