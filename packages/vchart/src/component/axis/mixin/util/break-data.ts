import { combineDomains } from '../../../../util/array';

const setDomain = (min: number, max: number, breaks: number[]): [number, number][] =>
  breaks.reduce(
    (r, b, i) => {
      r.push([b, breaks.length === i + 1 ? max : breaks[i + 1]]);
      return r;
    },
    [[min, breaks[0]]]
  );

function breakDomain(min: number, max: number, points: number[]): [number, number][] {
  const breaks = points.filter(point => point > min && point < max);
  if (breaks.length === 0) {
    return [[min, max]];
  }

  return setDomain(min, max, breaks);
}

const sorter = (a: number, b: number) => a - b;

function breakCountScope(data: number[], points: number[]): [number, number][] {
  const scope: [number, number][] = [];
  let cursor = 0;
  for (const point of points) {
    const previous = cursor;
    while (cursor < data.length && data[cursor] <= point) {
      cursor++;
    }
    // 保留内部的空段，两端无数据的区间不参与计数。
    if (previous < cursor || (cursor > 0 && cursor < data.length)) {
      scope.push([previous / data.length, cursor / data.length]);
    }
  }
  if (cursor < data.length || !scope.length) {
    scope.push([cursor ? cursor / data.length : 0, 1]);
  }
  return scope;
}

export function getLengthBreakScope(domain: number[], lengthSegments: boolean[]): [number, number][] {
  let total = 0;
  const scope: [number, number][] = lengthSegments.map((visible, index) => {
    const start = total;
    if (visible) {
      total += domain[index + 1] - domain[index];
    }
    return [start, total];
  });
  if (total > 0) {
    for (const segment of scope) {
      segment[0] /= total;
      segment[1] /= total;
    }
  } else {
    scope[scope.length - 1][1] = 1;
  }
  return scope;
}

export function breakData(
  data: number[],
  points: number[],
  scopeType?: 'count' | 'length',
  bounds?: { min?: number; max?: number }
) {
  // 现将数据和断点排序
  data.sort(sorter);
  points.sort(sorter);

  const min = data[0];
  const max = data[data.length - 1];
  if (scopeType !== 'length') {
    return { domain: breakDomain(min, max, points), scope: breakCountScope(data, points) };
  }

  const domain = breakDomain(bounds?.min ?? min, bounds?.max ?? max, points);
  let cursor = 0;
  const lengthSegments = domain.map(([start, end], index) => {
    // 端部保留轴域留白，内部区间只按严格落在两端之间的观测值判断。
    if (index === 0 || index === domain.length - 1) {
      return true;
    }
    while (cursor < data.length && data[cursor] <= start) {
      cursor++;
    }
    return cursor < data.length && data[cursor] < end;
  });
  return { domain, scope: getLengthBreakScope(combineDomains(domain), lengthSegments), lengthSegments };
}
