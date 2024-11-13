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
  const bins = [0];
  let i = 0;
  let j = 0;
  while (i < points.length) {
    if (data[j] <= points[i]) {
      bins[i] += 1;
      j += 1;
    } else {
      i += 1;
      bins[i] = 0;
    }
  }
  bins[i] = data.slice(j).length;
  return bins;
};

function breakScope(data: number[], points: number[]): [number, number][] {
  // 默认 data 和 points 已经排序
  const bins = fillBins(data, points);
  const count = data.length;
  return bins
    .reduce((res, bin, i) => {
      const last = res[i - 1] ? res[i - 1][1] : 0;
      const next = (last * 100 + +(bin / count).toFixed(2) * 100) / 100; // Fuck you, JavaScript
      res.push([last, next > 1 ? 1 : next]);
      return res;
    }, [])
    .filter(s => {
      return !(s[0] === 0 && s[1] === 0) && !(s[0] === 1 && s[1] === 1);
    });
}

export function breakData(data: number[], points: number[]) {
  // 现将数据和断点排序
  data.sort(sorter);
  points.sort(sorter);

  return {
    domain: breakDomain(data, points),
    scope: breakScope(data, points)
  };
}
