import { validateStatPlot } from '../../src/validate';
import { compileStatPlot } from '../../src/compile';
import { layoutSwarm } from '../../src/series/swarm/layout';
import fs from 'fs';
import path from 'path';
import { paletteColor } from '../../src/common/theme';
test.each(['hexbinPlot', 'shapBeeswarmPlot', 'pairPlot'])('%s example passes the statistical contract', type => {
  const spec = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../examples/specs', `${type}.json`), 'utf8'));
  const original = JSON.stringify(spec);
  expect(validateStatPlot(spec)).toEqual({ valid: true, errors: [] });
  compileStatPlot(spec);
  expect(JSON.stringify(spec)).toBe(original);
});
test('swarm has no collisions, is stable under input reordering and reports crowding', () => {
  const points = Array.from({ length: 50 }, (_, i) => ({ id: String(i), valuePosition: (i % 10) * 10, radius: 3.5 }));
  const a = layoutSwarm(points, 40);
  const b = layoutSwarm(points.slice().reverse(), 40);
  expect(a).toEqual(b);
  expect(a.overflow).toBe(0);
  const pos = new Map(points.map(p => [p.id, p.valuePosition]));
  for (let i = 0; i < a.placements.length; i++) {
    for (let j = 0; j < i; j++) {
      const x = a.placements[i],
        y = a.placements[j];
      expect((x.offset - y.offset) ** 2 + (pos.get(x.id)! - pos.get(y.id)!) ** 2).toBeGreaterThanOrEqual(49);
    }
  }
  expect(
    layoutSwarm(
      Array.from({ length: 1000 }, (_, i) => ({ id: String(i), valuePosition: 0, radius: 3.5 })),
      20
    ).overflow
  ).toBeGreaterThan(900);
});
test('pair plot rejects legacy precomputed diagonal input', () => {
  const spec = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../examples/specs/pairPlot.json'), 'utf8'));
  spec.data.diagonal = [];
  expect(validateStatPlot(spec).errors).toEqual(
    expect.arrayContaining([expect.objectContaining({ code: 'SCHEMA_ERROR', path: '/data/diagonal' })])
  );
});
test('SHAP rejects duplicate observation-feature keys', () => {
  expect(
    validateStatPlot({
      type: 'shapBeeswarmPlot',
      featureOrder: ['x'],
      data: [
        { id: 'a', feature: 'x', shapValue: 1, featureValue: 1 },
        { id: 'a', feature: 'x', shapValue: 2, featureValue: 2 }
      ]
    }).valid
  ).toBe(false);
});

test.each([
  [-1e308, 0, 1e308],
  [-Number.MAX_VALUE, 0, Number.MAX_VALUE],
  [-2, 0, 2],
  [0, Number.MIN_VALUE, Number.MIN_VALUE * 2]
])('SHAP preserves low, middle and high colors for finite range [%j, %j, %j]', (low, middle, high) => {
  const spec = {
    type: 'shapBeeswarmPlot' as const,
    featureOrder: ['x'],
    colors: { sequential: ['#000000', '#808080', '#ffffff'] },
    data: [low, middle, high].map((featureValue, i) => ({
      id: String(i),
      feature: 'x',
      shapValue: i - 1,
      featureValue
    }))
  };
  expect(validateStatPlot(spec)).toEqual({ valid: true, errors: [] });
  const chart: any = compileStatPlot(spec);
  const values = chart.series[0].data.values;
  expect(values.map((row: any) => row.__featureColor)).toEqual([0, 0.5, 1]);
  expect(values.map((row: any) => row.__fill)).toEqual(['rgb(0,0,0)', 'rgb(128,128,128)', 'rgb(255,255,255)']);
});

test('SHAP keeps missing and constant feature colors when another feature has a wide range', () => {
  const chart: any = compileStatPlot({
    type: 'shapBeeswarmPlot',
    featureOrder: ['wide', 'constant', 'missing'],
    data: [
      { id: 'a', feature: 'wide', shapValue: -1, featureValue: -1e308 },
      { id: 'b', feature: 'wide', shapValue: 1, featureValue: 1e308 },
      { id: 'c', feature: 'constant', shapValue: 0, featureValue: 1e308 },
      { id: 'd', feature: 'missing', shapValue: 0, featureValue: null }
    ]
  });
  const series = chart.series[0];
  const values = series.data.values;
  expect(values.map((row: any) => row.__featureColor)).toEqual([0, 1, 0.5, null]);
  expect(values.map((row: any) => series.point.style.fill(row))).toEqual([
    'rgb(68,1,84)',
    'rgb(253,231,37)',
    paletteColor('light', 'tertiaryFontColor'),
    paletteColor('light', 'disableFontColor')
  ]);
});
