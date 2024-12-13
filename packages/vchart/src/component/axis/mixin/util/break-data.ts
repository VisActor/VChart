import { last } from '@visactor/vutils';

const setDomain = (min: number, max: number, breaks: number[]): [number, number][] =>
  breaks.reduce(
    (r, b, i) => {
      r.push([b, breaks.length === i + 1 ? max : breaks[i + 1]]);
      return r;
    },
    [[min, breaks[0]]]
  );

function breakDomain(data: number[], points: number[]): [number, number][] {
  // 默认数据已经排序
  const min = data[0];
  const max = data[data.length - 1];
  const breaks = points.filter(point => point > min && point < max);
  if (breaks.length === 0) {
    return [[min, max]];
  }

  return setDomain(min, max, breaks);
}

const sorter = (a: number, b: number) => a - b;

const fillBins = (data: number[], points: number[]) => {
  const bins: Array<{ count: number; sub: number[]; max: number; min: number }> = [
    { count: 0, sub: [], max: points[0], min: points[0] }
  ];
  let i = 0;
  let j = 0;
  while (i < points.length) {
    if (data[j] <= points[i]) {
      bins[i].count += 1;
      bins[i].sub.push(data[j]);
      j += 1;
    } else {
      i += 1;
      bins[i] = { count: 0, sub: [], max: points[i], min: points[i] };
    }
  }
  bins.forEach(bin => {
    if (bin.count) {
      bin.min = Math.min.apply(null, bin.sub);
    }
  });

  const remain = data.slice(j);
  bins[i] = { count: remain.length, sub: remain, min: points[points.length - 1], max: Math.max.apply(null, remain) };
  return bins;
};

function breakScope(data: number[], points: number[], scopeType: 'count' | 'length' = 'count'): [number, number][] {
  // 默认 data 和 points 已经排序
  const bins = fillBins(data, points);

  const totalLength =
    scopeType === 'count'
      ? data.length
      : bins.reduce((res, bin, i) => {
          return bin.count > 0 ? res + bin.max - bin.min : res;
        }, 0);
  const res: [number, number][] = [];
  let acc = 0;

  bins.forEach((bin, i) => {
    if (totalLength === 0) {
      res.push([0, i / bins.length - 1]);
    } else {
      const length = scopeType === 'count' ? bin.count : bin.max - bin.min;
      const b0 = res[i - 1] ? res[i - 1][1] : 0;
      const b1 = i === bins.length - 1 ? 1 : Math.min((acc + length) / totalLength, 1);

      if (b0 === b1 && (b0 === 0 || b0 === 1)) {
      } else {
        res.push([b0, b1]);
        acc += length;
      }
    }
  });

  return res;
}

export function breakScopeByLength(
  domain: [number, number][],
  breakDomains: [number, number][],
  finalDomain: number[]
): [number, number][] {
  const d0 = finalDomain[0];
  const d1 = last(finalDomain);
  const newDomain: { isBreak?: boolean; domain: [number, number] }[] = [];
  let sum = 0;

  domain.forEach((d, index) => {
    if (breakDomains.some(b => b[0] === d[0] && b[1] === d[1])) {
      newDomain.push({
        isBreak: true,
        domain: d
      });
    } else {
      const newD0 = index === 0 ? d0 : d[0];
      const newD1 = index === domain.length - 1 ? d1 : d[1];
      newDomain.push({ domain: [newD0, newD1] });
      sum += newD1 - newD0;
    }
  });

  return sum > 0
    ? newDomain.reduce((res, d, index) => {
        const r = d.isBreak ? 0 : (d.domain[1] - d.domain[0]) / sum;

        if (index === 0) {
          res.push([0, r]);
        } else {
          res.push([res[index - 1][1], res[index - 1][1] + r]);
        }

        return res;
      }, [])
    : [[0, 1]];
}

export function breakData(data: number[], points: number[], scopeType?: 'count' | 'length') {
  // 现将数据和断点排序
  data.sort(sorter);
  points.sort(sorter);

  return {
    domain: breakDomain(data, points),
    scope: scopeType === 'count' ? breakScope(data, points, scopeType) : []
  };
}
