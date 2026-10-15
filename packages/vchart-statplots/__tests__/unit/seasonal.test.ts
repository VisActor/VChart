import { compileStatPlot } from '../../src/compile';
import { validateStatPlot } from '../../src/validate';
import type { SeasonalPlotSpec } from '../../src/types';
const phaseOrder = ['Q1', 'Q2', 'Q3', 'Q4'];
const cycleOrder = ['2024', '2025', '2026'];
const data = cycleOrder.flatMap((cycle, year) =>
  phaseOrder.map((phase, quarter) => ({ cycle, phase, value: year * 10 + quarter }))
);
const spec = { type: 'seasonalPlot', layout: 'subseries', phaseOrder, cycleOrder, data } as SeasonalPlotSpec;
test('subseries groups phases and orders cycles independently of input order', () => {
  const chart = compileStatPlot({ ...spec, data: [...data].reverse() }) as any;
  expect(chart.region).toHaveLength(4);
  chart.series.forEach((series: any, i: number) => {
    expect(series.xField).toBe('cycle');
    expect(series.data.values.map((r: any) => r.phase)).toEqual(Array(3).fill(phaseOrder[i]));
    expect(series.data.values.map((r: any) => r.cycle)).toEqual(cycleOrder);
    expect(series.data.values.map((r: any) => r.value)).toEqual([i, 10 + i, 20 + i]);
  });
});
test('subseries respects explicit order, preserves zero and exposes gaps', () => {
  const chart = compileStatPlot({
    ...spec,
    cycleOrder: ['2026', '2024', '2025'],
    data: data.filter(r => r.phase !== 'Q1' || r.cycle !== '2025')
  }) as any;
  expect(chart.series[0].data.values.map((r: any) => r.value)).toEqual([20, 0, null]);
  expect(chart.series[0].invalidType).toBe('break');
});
test('overlay orders phases and creates gaps without mutating input', () => {
  const input = { ...spec, layout: 'overlay' as const, data: data.filter(r => r.phase !== 'Q2' || r.cycle !== '2024') };
  const before = JSON.stringify(input);
  const chart = compileStatPlot(input) as any;
  expect(chart.series[0].xField).toBe('phase');
  expect(chart.series[0].data.values.slice(0, 4).map((r: any) => r.value)).toEqual([0, null, 2, 3]);
  expect(JSON.stringify(input)).toBe(before);
});
test.each([{ cycleOrder: [] }, { phaseOrder: ['Q1', 'Q1'] }, { cycleOrder: ['2024'] }, { data: [...data, data[0]] }])(
  'rejects ambiguous seasonal order or duplicate observations: %j',
  patch => {
    expect(validateStatPlot({ ...spec, ...patch }).valid).toBe(false);
  }
);
test('allows declared empty positions and handles an empty chart', () => {
  expect(validateStatPlot({ ...spec, phaseOrder: [...phaseOrder, 'Q5'] }).valid).toBe(true);
  expect((compileStatPlot({ ...spec, data: [] }) as any).title.subtext).toContain('暂无可绘制数据');
});
test('overlay grouping does not merge series and cycles containing the display separator', () => {
  const chart = compileStatPlot({
    type: 'seasonalPlot',
    cycleOrder: ['B / C', 'C'],
    phaseOrder: ['Q1', 'Q2'],
    data: [
      { series: 'A', cycle: 'B / C', phase: 'Q1', value: 1 },
      { series: 'A', cycle: 'B / C', phase: 'Q2', value: 2 },
      { series: 'A / B', cycle: 'C', phase: 'Q1', value: 3 },
      { series: 'A / B', cycle: 'C', phase: 'Q2', value: 4 }
    ]
  }) as any;
  const line = chart.series[0];
  const keys = line.data.values.map((row: any) => row[line.seriesField]);
  expect(new Set(keys).size).toBe(2);
  expect(keys[0]).toBe(keys[1]);
  expect(keys[2]).toBe(keys[3]);
  expect(chart.legends.item.label.formatMethod(keys[0])).toBe('A / B / C');
});
