import { validateStatPlot } from '../../src/validate';
import { compileStatPlot } from '../../src/compile';
import { layoutSwarm } from '../../src/series/swarm/layout';
import fs from 'fs';
import path from 'path';
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
