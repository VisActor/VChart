import { compileStatPlot as compile } from '../../src/compile';
import type { ICommonChartSpec } from '@visactor/vchart';
import { aggregateConfusionMatrix } from '../../src/plots/confusion-matrix/aggregation';
import type { ConfusionMatrixSpec } from '../../src/types';
import { correlationExample } from '../fixtures/correlation-matrix';

const compileStatPlot = (spec: Parameters<typeof compile>[0]) => compile(spec) as ICommonChartSpec;

const example: ConfusionMatrixSpec = {
  type: 'confusionMatrix',
  classOrder: ['A', 'B', 'C'],
  data: [
    { actual: 'A', predicted: 'A' },
    { actual: 'A', predicted: 'B' },
    { actual: 'A', predicted: 'B' },
    { actual: 'B', predicted: 'B' }
  ]
};

test.each([example, correlationExample])('$type uses the shared square layout and contiguous matrix axes', spec => {
  const chart = compileStatPlot(spec);
  expect(chart.layout).toEqual({ type: 'statplotsMatrix' });
  for (const axis of chart.axes!) {
    expect(axis).toMatchObject({
      paddingInner: 0,
      paddingOuter: 0,
      domainLine: { visible: false },
      tick: { visible: false }
    });
  }
});

test.each(['none', 'actual', 'predicted', 'all'] as const)(
  '%s retains computed values and uses the same cell grid',
  mode => {
    const spec = { ...example, normalization: mode };
    const before = JSON.stringify(spec);
    const chart = compileStatPlot(spec);
    const rows = chart.series!.flatMap(s => (s as any).data.values);
    expect(rows).toEqual(expect.arrayContaining(aggregateConfusionMatrix(spec).values));
    expect(rows).toHaveLength(9);
    expect(chart.axes!.map(a => a.title!.text)).toEqual(['预测类别', '实际类别']);
    for (const series of chart.series!) {
      expect((series as any).cell.style).toMatchObject({ lineWidth: 1 });
      expect((series as any).label).toMatchObject({
        overlap: { hideOnHit: true, avoidBaseMark: false },
        style: { fontSize: 11, boundsPadding: 0 }
      });
    }
    expect(chart.legends).toEqual({ visible: false });
    expect(chart.customMark).toHaveLength(1);
    expect(JSON.stringify(spec)).toBe(before);
  }
);

test.each([1, 3, 10])('count maximum %i has distinct integer colorbar ticks', max => {
  const chart = compileStatPlot({ ...example, data: Array.from({ length: max }, () => example.data[0]) });
  const bar = chart.customMark![0] as any;
  const ticks = bar.children.filter((m: any) => m.name === 'confusion-colorbar-tick').map((m: any) => m.style.text);
  expect(ticks).toEqual(max === 1 ? ['0', '1'] : max === 3 ? ['0', '1', '2', '3'] : ['0', '3', '6', '9', '10']);
  expect(bar.children.find((m: any) => m.name === 'confusion-colorbar-title').style.text).toBe('计数');
});

test('proportions keep a fixed unit domain and zero denominators stay NA', () => {
  const chart = compileStatPlot({ ...example, normalization: 'actual', fieldLabels: { proportion: '召回占比' } });
  const missing = (chart.series![1] as any).data.values;
  expect(missing).toHaveLength(3);
  expect(missing.every((r: any) => r.actual === 'C' && r.value === null && r.count === 0)).toBe(true);
  const domain = chart.scales![0].domain as number[];
  expect([domain[0], domain[domain.length - 1]]).toEqual([0, 1]);
  const bar = chart.customMark![0] as any;
  expect(bar.children.find((m: any) => m.name === 'confusion-colorbar-title').style.text).toBe('召回占比');
  expect(bar.children.filter((m: any) => m.name === 'confusion-colorbar-tick').map((m: any) => m.style.text)).toEqual([
    '0%',
    '25%',
    '50%',
    '75%',
    '100%'
  ]);
});

test('empty input retains the empty state and omits the static colorbar', () => {
  const chart = compileStatPlot({ ...example, data: [] });
  expect(chart.customMark).toEqual([]);
  expect(chart.title!.subtext).toContain('暂无可绘制数据');
  expect(chart.series!.every(s => !(s as any).data.values.length)).toBe(true);
});
