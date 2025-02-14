import { MarkTypeEnum } from '../interface/type';
import type { Datum } from '../../typings';
import { Direction } from '../../typings';
import type { GroupedData } from '../interface/common';
import { DEFAULT_KEY } from '../../constant/data';
import { isNil, isString } from '@visactor/vutils';
import type { IColor, IColorStop } from '@visactor/vrender-core';
import { Factory } from '../../core/factory';

export const MultiDatumMark = [MarkTypeEnum.line, MarkTypeEnum.area, 'trail'];

export function isMultiDatumMark(type: MarkTypeEnum) {
  return MultiDatumMark.includes(type);
}

export function curveTypeTransform(type: string, direction: string) {
  if (type === 'monotone') {
    return direction === Direction.horizontal ? 'monotoneY' : 'monotoneX';
  }
  return type;
}

export function is3DMark(type: MarkTypeEnum) {
  return [MarkTypeEnum.arc3d, MarkTypeEnum.rect3d, MarkTypeEnum.pyramid3d].includes(type);
}

export function groupData<T>(
  data: T[],
  groupBy: (datum: Datum) => string,
  sort?: (a: T, b: T) => number
): GroupedData<T> {
  const groupedData = new Map();
  if (!data || data.length === 0) {
    return { keys: [], data: groupedData };
  }
  if (!groupBy) {
    groupedData.set(DEFAULT_KEY, sort ? data.slice().sort(sort) : data.slice());
    return { keys: [DEFAULT_KEY], data: groupedData };
  }
  // const keyGetter = parseField(key);

  if (data.length === 1) {
    const key = groupBy(data[0]);
    groupedData.set(key, [data[0]]);

    return {
      keys: [key],
      data: groupedData
    };
  }

  const keys = new Set<string>();
  data.forEach(entry => {
    const key = groupBy(entry);
    const lastData = groupedData.get(key) ?? [];
    lastData.push(entry);
    groupedData.set(key, lastData);
    keys.add(key);
  });
  if (sort) {
    keys.forEach(key => {
      groupedData.get(key).sort(sort);
    });
  }
  return { keys: Array.from(keys), data: groupedData };
}

export const runEncoder = (styles: Record<string, (datum: Datum) => any>, datum: Datum, attrs: any = {}) => {
  Object.keys(styles).forEach(attrName => {
    attrs[attrName] = styles[attrName](datum);
  });

  return attrs;
};

export const isStopsEqual = (prev: IColorStop[], next: IColorStop[]) => {
  if (prev === next) {
    return true;
  }
  const prevLength = (prev && prev.length) ?? 0;
  const nextLength = (next && next.length) ?? 0;

  if (prevLength !== nextLength || prevLength === 0) {
    return false;
  }

  return prev.every((prevEntry, prevIndex) => {
    return (
      (!prevEntry && !next[prevIndex]) ||
      (prevEntry &&
        next[prevIndex] &&
        prevEntry.color === next[prevIndex].color &&
        prevEntry.offset === next[prevIndex].offset)
    );
  });
};

const isColorAttrEqual = (prev: IColor, next: IColor) => {
  if (prev === next) {
    return true;
  }

  if (typeof prev !== typeof next) {
    return false;
  }

  if (isString(prev)) {
    return false;
  }

  if (prev.gradient !== (next as any).gradient) {
    return false;
  }

  const prevKeys = Object.keys(prev);
  const nextKeys = Object.keys(next);

  if (prevKeys.length !== nextKeys.length) {
    return false;
  }

  return prevKeys.every(key => {
    if (key === 'stops') {
      return isStopsEqual(prev[key], (next as any)[key]);
    }

    return (prev as any)[key] === (next as any)[key];
  });
};

const isLineDashEqual = (prev: number[], next: number[]) => {
  if (prev.length !== next.length) {
    return false;
  }

  if (prev.join('-') === next.join('-')) {
    return true;
  }

  return false;
};

export const isSegmentAttrEqual = (prev: any, next: any, key: string) => {
  if (isNil(prev) && isNil(next)) {
    return true;
  }

  if (isNil(prev)) {
    return false;
  }

  if (isNil(next)) {
    return false;
  }

  if (key === 'lineDash') {
    return isLineDashEqual(prev, next);
  }

  if (key === 'stroke' || key === 'fill') {
    return isColorAttrEqual(prev, next);
  }

  return prev === next;
};
