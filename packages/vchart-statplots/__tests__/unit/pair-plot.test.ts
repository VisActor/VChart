import { compileStatPlot } from '../../src/compile';
import { validateStatPlot } from '../../src/validate';
import { StatPlotValidationError } from '../../src/errors';
import { pairObservations } from '../fixtures/pair-plot';

const spec = { type: 'pairPlot' as const, variables: ['x', 'y'], data: { observations: pairObservations } };

test('raw observations alone create default histograms with shared variable domains', () => {
  expect(validateStatPlot(spec)).toEqual({ valid: true, errors: [] });
  const chart = compileStatPlot(spec) as any;
  const bins = chart.series.find((s: any) => s.id === 'diagonal-0').data.values;
  expect(bins).toHaveLength(4);
  expect(bins.reduce((sum: number, b: any) => sum + b.count, 0)).toBe(5);
  expect(chart.series.find((s: any) => s.id === 'scatter-0-1').data.values).toHaveLength(4);
  expect(chart.axes.find((a: any) => a.id === 'x-1-0').min).toBe(0);
  expect(chart.axes.find((a: any) => a.id === 'x-1-0').max).toBe(4);
  expect(chart.brush.brushLinkDataKey).toBe('id');
});

test.each([undefined, {}, { type: 'histogram' }, { binning: {} }])('histogram default accepts %j', diagonal => {
  expect(validateStatPlot({ ...spec, diagonal }).valid).toBe(true);
});

test('legacy diagonal bins are rejected with their public path', () => {
  expect(validateStatPlot({ ...spec, data: { ...spec.data, diagonal: [] } }).errors).toEqual(
    expect.arrayContaining([expect.objectContaining({ code: 'SCHEMA_ERROR', path: '/data/diagonal' })])
  );
});

test.each([0, -1, 0.5, 201, '20', null])('rejects invalid binCount %j', binCount => {
  expect(validateStatPlot({ ...spec, diagonal: { binning: { binCount } } }).errors).toEqual(
    expect.arrayContaining([expect.objectContaining({ path: '/diagonal/binning/binCount' })])
  );
});

test.each([1, 2, 200])('accepts explicit binCount %s', binCount => {
  expect(validateStatPlot({ ...spec, diagonal: { binning: { binCount } } }).valid).toBe(true);
});

test('none excludes histogram series and preserves scatter linkage', () => {
  const chart = compileStatPlot({ ...spec, diagonal: { type: 'none' } } as any) as any;
  expect(chart.series.map((s: any) => s.id)).toEqual(['scatter-0-1', 'scatter-1-0']);
  expect(chart.axes.find((a: any) => a.id === 'y-0-0').title.text).toBe('x');
  expect(chart.brush.brushLinkSeriesId).toHaveLength(2);
  expect(validateStatPlot({ ...spec, diagonal: { type: 'none', binning: {} } }).valid).toBe(false);
});

test('empty input and all-null columns do not manufacture bars', () => {
  const chart = compileStatPlot({ ...spec, data: { observations: [] } }) as any;
  expect(chart.title.subtext).toContain('暂无可绘制数据');
  expect(chart.series.every((s: any) => s.data.values.length === 0)).toBe(true);
  const missing = compileStatPlot({ ...spec, data: { observations: [{ id: '0', values: { x: 0, y: null } }] } }) as any;
  expect(missing.series.find((s: any) => s.id === 'diagonal-1').data.values).toEqual([]);
  expect(missing.axes.find((a: any) => a.id === 'y-1-1').title.text).toBe('计数 · n=0');
});

test('number domains and explicit bin resolution fail at the public boundary', () => {
  const close = {
    ...spec,
    data: {
      observations: [
        { id: '0', values: { x: 1, y: 0 } },
        { id: '1', values: { x: 1 + Number.EPSILON, y: 1 } }
      ]
    }
  };
  expect(validateStatPlot(close).valid).toBe(true);
  const explicit = { ...close, diagonal: { binning: { binCount: 2 } } };
  expect(validateStatPlot(explicit).errors).toEqual(
    expect.arrayContaining([expect.objectContaining({ code: 'INVALID_RANGE', path: '/diagonal/binning/binCount' })])
  );
  expect(() => compileStatPlot(explicit as any)).toThrow(StatPlotValidationError);
  const overflow = {
    ...spec,
    data: {
      observations: [
        { id: '0', values: { x: -Number.MAX_VALUE, y: 0 } },
        { id: '1', values: { x: Number.MAX_VALUE, y: 1 } }
      ]
    }
  };
  for (const diagonal of [undefined, { type: 'none' }]) {
    expect(validateStatPlot({ ...overflow, diagonal }).errors).toEqual(
      expect.arrayContaining([expect.objectContaining({ code: 'INVALID_RANGE', path: '/data/observations' })])
    );
  }
});

test.each(
  [
    [{ id: '0', values: { x: 1 } }],
    [{ id: '0', values: { x: 1, y: 2, z: 3 } }],
    [{ id: '0', values: { x: NaN, y: 2 } }],
    [{ id: '0', values: { x: Infinity, y: 2 } }],
    [{ id: '0', values: { x: '1', y: 2 } }],
    [
      { id: '0', values: { x: 1, y: 2 } },
      { id: '0', values: { x: 1, y: 2 } }
    ],
    [
      { id: '0', series: 'A', values: { x: 1, y: 2 } },
      { id: '1', values: { x: 1, y: 2 } }
    ]
  ].map(observations => ({ observations }))
)('preserves strict observation validation %#', ({ observations }) => {
  expect(validateStatPlot({ ...spec, data: { observations } }).valid).toBe(false);
});

test('themes and colors preserve counts and edges', () => {
  const initial = compileStatPlot(spec) as any;
  const changed = compileStatPlot({ ...spec, theme: 'dark', colors: { categorical: 'deep' } }) as any;
  expect(changed.series.map((s: any) => s.data.values)).toEqual(initial.series.map((s: any) => s.data.values));
});
