import { forEach, isEqual } from 'lodash';

export default (oldData, newData) => {
  const changes = [];
  forEach(newData, (newItem, id) => {
    const oldItem = oldData[id];
    if (oldItem === undefined) {
      changes.push([null, newItem]);
    } else if (!isEqual(oldItem, newItem)) {
      changes.push([oldItem, newItem]);
    }
  });
  forEach(oldData, (oldItem, id) => {
    const newItem = newData[id];
    if (newItem === undefined) {
      changes.push([oldItem, null]);
    }
  });
  return changes;
};
