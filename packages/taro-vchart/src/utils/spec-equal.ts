function isPlainObject(value: object): boolean {
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function equalSpecValue(left: unknown, right: unknown, active: WeakMap<object, object>): boolean {
  if (left === right) return true;
  if (typeof left === 'number' && typeof right === 'number' && Number.isNaN(left) && Number.isNaN(right)) {
    return true;
  }
  if (typeof left !== typeof right || left === null || right === null) return false;
  if (typeof left !== 'object' || typeof right !== 'object') return false;

  if (left instanceof Date || right instanceof Date) {
    if (!(left instanceof Date) || !(right instanceof Date)) return false;
    const leftTime = left.getTime();
    const rightTime = right.getTime();
    return leftTime === rightTime || (Number.isNaN(leftTime) && Number.isNaN(rightTime));
  }

  const leftIsArray = Array.isArray(left);
  if (leftIsArray !== Array.isArray(right)) return false;
  if (!leftIsArray && (!isPlainObject(left) || !isPlainObject(right))) return false;

  const leftObject = left as object;
  const rightObject = right as object;
  const activeRight = active.get(leftObject);
  if (activeRight) return activeRight === rightObject;
  active.set(leftObject, rightObject);

  if (leftIsArray) {
    const leftArray = left as unknown[];
    const rightArray = right as unknown[];
    if (leftArray.length !== rightArray.length) {
      active.delete(leftObject);
      return false;
    }
    for (let index = leftArray.length - 1; index >= 0; index--) {
      if (!equalSpecValue(leftArray[index], rightArray[index], active)) {
        active.delete(leftObject);
        return false;
      }
    }
    active.delete(leftObject);
    return true;
  }

  const leftRecord = left as Record<string, unknown>;
  const rightRecord = right as Record<string, unknown>;
  const leftKeys = Object.keys(leftRecord);
  const rightKeys = Object.keys(rightRecord);
  if (leftKeys.length !== rightKeys.length) {
    active.delete(leftObject);
    return false;
  }
  for (const key of leftKeys) {
    if (
      !Object.prototype.hasOwnProperty.call(rightRecord, key) ||
      !equalSpecValue(leftRecord[key], rightRecord[key], active)
    ) {
      active.delete(leftObject);
      return false;
    }
  }
  active.delete(leftObject);
  return true;
}

/** Compare chart specs without serializing callback values or cyclic data. */
export function isSpecEqual(left: unknown, right: unknown): boolean {
  return equalSpecValue(left, right, new WeakMap());
}
