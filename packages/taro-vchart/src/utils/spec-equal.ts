function isComparableObject(value: object): boolean {
  const prototype = Object.getPrototypeOf(value);
  return (
    prototype === Object.prototype ||
    prototype === null ||
    Object.keys(value).length > 0
  );
}

function equalSpecValue(
  left: unknown,
  right: unknown,
  active: WeakMap<object, object>,
  activeReverse: WeakMap<object, object>
): boolean {
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
  if (!leftIsArray && (!isComparableObject(left) || !isComparableObject(right))) return false;

  const leftObject = left as object;
  const rightObject = right as object;
  const activeRight = active.get(leftObject);
  if (activeRight) return activeRight === rightObject;
  const activeLeft = activeReverse.get(rightObject);
  if (activeLeft) return activeLeft === leftObject;
  active.set(leftObject, rightObject);
  activeReverse.set(rightObject, leftObject);
  const untrack = () => {
    active.delete(leftObject);
    activeReverse.delete(rightObject);
  };

  if (leftIsArray) {
    const leftArray = left as unknown[];
    const rightArray = right as unknown[];
    if (leftArray.length !== rightArray.length) {
      untrack();
      return false;
    }
    for (let index = leftArray.length - 1; index >= 0; index--) {
      if (!equalSpecValue(leftArray[index], rightArray[index], active, activeReverse)) {
        untrack();
        return false;
      }
    }
    untrack();
    return true;
  }

  const leftRecord = left as Record<string, unknown>;
  const rightRecord = right as Record<string, unknown>;
  const leftKeys = Object.keys(leftRecord);
  const rightKeys = Object.keys(rightRecord);
  let leftDefinedKeyCount = 0;
  let rightDefinedKeyCount = 0;
  for (const key of leftKeys) {
    if (leftRecord[key] !== undefined) leftDefinedKeyCount++;
  }
  for (const key of rightKeys) {
    if (rightRecord[key] !== undefined) rightDefinedKeyCount++;
  }
  if (leftDefinedKeyCount !== rightDefinedKeyCount) {
    untrack();
    return false;
  }
  for (const key of leftKeys) {
    const leftValue = leftRecord[key];
    if (leftValue === undefined) continue;
    if (
      !Object.prototype.hasOwnProperty.call(rightRecord, key) ||
      !equalSpecValue(leftValue, rightRecord[key], active, activeReverse)
    ) {
      untrack();
      return false;
    }
  }
  untrack();
  return true;
}

/** Compare chart specs without serializing callback values or cyclic data. */
export function isSpecEqual(left: unknown, right: unknown): boolean {
  return equalSpecValue(left, right, new WeakMap(), new WeakMap());
}
