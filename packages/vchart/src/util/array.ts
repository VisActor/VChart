import { array, last as peek, maxInArray as maxInArr, minInArray as minInArr } from '@visactor/vutils';

export function shallowCompare<T, U>(arrA: T | T[], arrB: U | U[]): boolean {
  const setA = new Set<T | U>(array(arrA));
  const setB = new Set<T | U>(array(arrB));
  if (setA.size !== setB.size) {
    return false;
  }
  for (const v of setA.values()) {
    if (!setB.has(v)) {
      return false;
    }
  }
  return true;
}

export { array, peek, maxInArr, minInArr };
