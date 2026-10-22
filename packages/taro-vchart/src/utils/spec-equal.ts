function isPlainObject(value: object): boolean {
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function equalSpecValue(left: unknown, right: unknown, visited: WeakMap<object, WeakSet<object>>): boolean {
  if (left === right) return true;
  if (typeof left === 'number' && typeof right === 'number' && Number.isNaN(left) && Number.isNaN(right)) {
    return true;
  }
  if (typeof left !== typeof right || left === null || right === null) return false;
  if (typeof left !== 'object' || typeof right !== 'object') return false;

  const leftTag = Object.prototype.toString.call(left);
  if (leftTag !== Object.prototype.toString.call(right)) return false;
  if (leftTag === '[object Date]') {
    const leftTime = Date.prototype.getTime.call(left as Date);
    const rightTime = Date.prototype.getTime.call(right as Date);
    return leftTime === rightTime || (Number.isNaN(leftTime) && Number.isNaN(rightTime));
  }

  const leftIsArray = Array.isArray(left);
  if (leftIsArray !== Array.isArray(right)) return false;
  if (!leftIsArray && (!isPlainObject(left) || !isPlainObject(right))) return false;

  const leftObject = left as object;
  const rightObject = right as object;
  const seenMatches = visited.get(leftObject);
  if (seenMatches?.has(rightObject)) return true;
  if (seenMatches) {
    seenMatches.add(rightObject);
  } else {
    visited.set(leftObject, new WeakSet([rightObject]));
  }

  if (leftIsArray) {
    const leftArray = left as unknown[];
    const rightArray = right as unknown[];
    if (leftArray.length !== rightArray.length) return false;
    for (let index = leftArray.length - 1; index >= 0; index--) {
      if (!equalSpecValue(leftArray[index], rightArray[index], visited)) return false;
    }
    return true;
  }

  const leftRecord = left as Record<string, unknown>;
  const rightRecord = right as Record<string, unknown>;
  const leftKeys = Object.keys(leftRecord);
  const rightKeys = Object.keys(rightRecord);
  if (leftKeys.length !== rightKeys.length) return false;
  for (const key of leftKeys) {
    if (!Object.prototype.hasOwnProperty.call(rightRecord, key)) return false;
    if (!equalSpecValue(leftRecord[key], rightRecord[key], visited)) return false;
  }
  return true;
}

/** Compare chart specs without serializing callback values or cyclic data. */
export function isSpecEqual(left: unknown, right: unknown): boolean {
  return equalSpecValue(left, right, new WeakMap());
}
