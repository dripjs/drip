const { describe, it } = global;
import { expect } from 'chai';

import { EventEmitter } from 'events';
import Client from '../src/methods/client';
import Server from '../src/methods/server';

describe('methods module', () => {
  let server;
  let client;
  let pubsub;

  beforeEach(() => {
    server = new Server;
    client = new Client;
    pubsub = new EventEmitter;
    server.addEmitter(pubsub);
    client.setEmitter(pubsub);
  });

  it('should call a method', done => {
    server.registerMethod('add', (a, b) => {
      expect(a).to.be.equal(1);
      expect(b).to.be.equal(2);
      return a + b;
    });
    client.call('add', 1, 2).then(result => {
      expect(result).to.be.equal(3);
      done();
    });
  });


  it('should error if method throws', done => {
    server.registerMethod('throwError', () => {
      throw new Error('dada');
    });
    client.call('throwError').catch(error => {
      expect(error.message).to.be.equal('dada');
      done();
    });
  });

  it('should work with promises', done => {
    server.registerMethod('addAsync', (a, b) =>
      new Promise(resolve => {
        setTimeout(() => resolve(a + b));
      })
    );
    client.call('addAsync', 3, 4).then(result => {
      expect(result).to.be.equal(7);
      done();
    });
  });

  it('should work with rejected promises', done => {
    server.registerMethod('rejectPromise', () =>
      new Promise((resolve, reject) => {
        setTimeout(() => reject(new Error('dada')));
      })
    );
    client.call('rejectPromise').catch(error => {
      expect(error.message).to.be.equal('dada');
      done();
    });
  });

  it('should error if method is not defined', done => {
    client.call('x').catch(error => {
      expect(error.name).to.be.equal('MethodNotFound');
      done();
    });
  });
});
