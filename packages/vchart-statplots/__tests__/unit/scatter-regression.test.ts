import { compileStatPlot } from '../../src/compile';
import { validateStatPlot } from '../../src/validate';
import type { ScatterPlotSpec } from '../../src/types';

const data = Array.from({ length: 12 }, (_, x) => ({ x, y: x * 2 + Math.sin(x), series: 'A' }));
const compile = (spec: ScatterPlotSpec): any => compileStatPlot(spec);
const rows = (chart: any, id: string): any[] => chart.series.find((s: any) => s.id === id)?.data.values ?? [];

test('default paired CI and its curve share x nodes, group models and legend filtering', () => {
  const spec: ScatterPlotSpec = {
    type: 'scatterPlot',
    data: [...data, ...data.map(p => ({ ...p, y: 8 - p.x, series: 'B' }))],
    fit: { input: 'observations', method: 'linear', sampling: { points: 9 } }
  };
  const before = JSON.stringify(spec),
    chart = compile(spec);
  expect(rows(chart, 'fit')).toHaveLength(18);
  expect(rows(chart, 'fit-band').map(p => p.x)).toEqual(rows(chart, 'fit').map(p => p.x));
  expect(chart.legends.seriesId).toEqual(['fit-band', 'fit', 'observations']);
  expect(rows(chart, 'fit').find(p => p.series === 'B').estimate).toBeCloseTo(8, 10);
  expect(rows(chart, 'fit')[0].interval).toContain('bootstrap');
  expect(rows(chart, 'fit')[0].sampleCount).toBe(12);
  expect(JSON.stringify(spec)).toBe(before);
  const reordered = compile({ ...spec, data: spec.data.slice().reverse() });
  const reverseRows = rows(reordered, 'fit').filter(p => p.series === 'A');
  const originalRows = rows(chart, 'fit').filter(p => p.series === 'A');
  reverseRows.forEach((p, i) => {
    // 浮点累加可有末位舍入差异；配对抽样排序使区间端点逐位确定。
    expect(p.estimate).toBeCloseTo(originalRows[i].estimate, 12);
    expect(p.lower).toBe(originalRows[i].lower);
    expect(p.upper).toBe(originalRows[i].upper);
  });
});

test('sampling affects drawing, not model predictions; no CI and small samples do not create bands', () => {
  const a = compile({
    type: 'scatterPlot',
    data,
    fit: { input: 'observations', method: 'linear', confidence: false, sampling: { points: 3 } }
  });
  const b = compile({
    type: 'scatterPlot',
    data,
    fit: { input: 'observations', method: 'linear', confidence: false, sampling: { points: 101 } }
  });
  expect(rows(a, 'fit')[1].estimate).toBeCloseTo(rows(b, 'fit')[50].estimate, 12);
  expect(rows(a, 'fit-band')).toHaveLength(0);
  const small = compile({
    type: 'scatterPlot',
    data: data.slice(0, 2),
    fit: { input: 'observations', method: 'linear' }
  });
  expect(rows(small, 'fit')[0].interval).toContain('样本不足');
  expect(rows(small, 'fit-band')).toHaveLength(0);
  expect(
    rows(
      compile({ type: 'scatterPlot', data: [], fit: { input: 'observations', method: 'polynomial', degree: 2 } }),
      'fit'
    )
  ).toEqual([]);
});

test('LOWESS draws observation nodes, including more than the old hidden sampling limit', () => {
  const many = Array.from({ length: 1100 }, (_, x) => ({ x, y: Math.sin(x / 80) }));
  const chart = compile({
    type: 'scatterPlot',
    data: many,
    fit: { input: 'observations', method: 'lowess', delta: 12 }
  });
  expect(rows(chart, 'fit')).toHaveLength(many.length);
  expect(rows(chart, 'fit-band')).toHaveLength(0);
  expect(rows(chart, 'fit')[0].method).toContain('delta=12');
});

test('external estimates retain model name and declared interval; legacy implicit fit is rejected', () => {
  const prepared: ScatterPlotSpec = {
    type: 'scatterPlot',
    data: [{ x: 0, y: 1 }],
    fit: {
      input: 'estimates',
      method: 'external',
      data: [{ x: 0, estimate: 1, lower: 0, upper: 2 }],
      interval: { kind: 'prediction', level: 0.9 }
    }
  };
  expect(rows(compile(prepared), 'fit')[0]).toMatchObject({ method: 'external', estimate: 1, lower: 0, upper: 2 });
  const old: Record<string, unknown> = { ...prepared.fit };
  delete old.input;
  expect(validateStatPlot({ ...prepared, fit: old }).valid).toBe(false);
});

test.each([
  { input: 'observations', method: 'linear', span: 0.5 },
  { input: 'observations', method: 'linear', data: [] },
  { input: 'observations', method: 'linear', sampling: { points: 1 } },
  { input: 'observations', method: 'linear', confidence: { kind: 'prediction' } },
  { input: 'observations', method: 'linear', confidence: { kind: 'confidence', level: 1 } },
  { input: 'observations', method: 'linear', confidence: { kind: 'confidence', resamples: 99 } },
  { input: 'observations', method: 'linear', confidence: { kind: 'confidence', seed: -1 } },
  { input: 'observations', method: 'polynomial', degree: 1 },
  { input: 'observations', method: 'polynomial', degree: 6 },
  { input: 'observations', method: 'lowess', confidence: { kind: 'confidence' } },
  { input: 'observations', method: 'lowess', sampling: { points: 10 } },
  { input: 'observations', method: 'lowess', span: 0 },
  { input: 'observations', method: 'lowess', iterations: 1.5 },
  { input: 'observations', method: 'lowess', delta: -1 }
])('rejects cross-model fields and invalid regression parameter: %j', fit => {
  expect(validateStatPlot({ type: 'scatterPlot', data, fit }).valid).toBe(false);
});
