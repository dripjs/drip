const { describe, it } = global;
import { expect } from 'chai';

import diff from '../src/diff';

const oldState = {
  1: { id: 1, name: 'Andrei', age: 22 },
  2: { id: 2, name: 'Paul', age: 12 },
  3: { id: 3, name: 'Carmen', age: 20 }
};

describe('diff', () => {
  it('should return blank if no changes', () => {
    expect(diff(oldState, oldState)).to.deep.equal([]);
  });
  it('should detect insert operation', () => {
    const newState = { ...oldState,
      4: { id: 4, name: 'Stefan', age: 23 }
    };
    const expectedDiff = [
      [null,
      { id: 4, name: 'Stefan', age: 23 }]
    ];
    expect(diff(oldState, newState)).to.deep.equal(expectedDiff);
  });
  it('should detect update operation', () => {
    const newState = { ...oldState,
      3: { id: 3, name: 'Carmen', age: 21 }
    };
    const expectedDiff = [
      [{ id: 3, name: 'Carmen', age: 20 },
      { id: 3, name: 'Carmen', age: 21 }]
    ];
    expect(diff(oldState, newState)).to.deep.equal(expectedDiff);
  });
  it('should detect delete operation', () => {
    const newState = { ...oldState,
      3: null
    };
    const expectedDiff = [
      [{ id: 3, name: 'Carmen', age: 20 },
      null]
    ];
    expect(diff(oldState, newState)).to.deep.equal(expectedDiff);
  });
  it('should detect a mix of operations', () => {
    const newState = { ...oldState,
      2: null,
      3: { id: 3, name: 'Carmen', age: 21 },
      4: { id: 4, name: 'Stefan', age: 23 },
      5: { id: 5, name: 'Kinga', age: 22 }
    };
    const expectedDiff = [
      [
        // delete
        { id: 2, name: 'Paul', age: 12 }, null
      ], [
        // update
        { id: 3, name: 'Carmen', age: 20 },
        { id: 3, name: 'Carmen', age: 21 }
      ], [
        // create
        null, { id: 4, name: 'Stefan', age: 23 }
      ], [
        // create
        null, { id: 5, name: 'Kinga', age: 22 }
      ]
    ];
    expect(diff(oldState, newState)).to.deep.have.members(expectedDiff);
  });
});
