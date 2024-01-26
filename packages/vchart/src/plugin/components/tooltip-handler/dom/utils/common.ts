import { isArray, isNil, isValid } from '@visactor/vutils';

export const getPixelPropertyStr = (num?: number | number[], defaultStr?: string) => {
  if (isValid(num)) {
    if (isArray(num)) {
      return num.map(n => `${n}px`).join(' ');
    }
    return `${num}px`;
  }
  return defaultStr ?? 'initial';
};

export const pixelPropertyStrToNumber = (str: string): number | number[] => {
  const strArr = str.split(' ');
  const numArr = strArr.map(n => {
    if (!Number.isNaN(n)) {
      return Number.parseFloat(n);
    }
    return Number.parseFloat(n.substring(0, n.length - 2));
  });
  if (numArr.length === 1) {
    return numArr[0];
  }
  return numArr;
};

let cacheScrollbarWidth: number | undefined;
export const getScrollbarWidth = (container = document.body) => {
  if (isNil(cacheScrollbarWidth)) {
    const outer = document.createElement('div');
    outer.style.visibility = 'hidden';
    outer.style.overflow = 'scroll';
    container.appendChild(outer);
    const inner = document.createElement('div');
    outer.appendChild(inner);
    cacheScrollbarWidth = outer.offsetWidth - inner.offsetWidth;
    outer.parentNode.removeChild(outer);
  }
  return cacheScrollbarWidth;
};
