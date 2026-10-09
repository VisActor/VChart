import fixture from '../fixtures/input-alignment-python.json';
import { compileStatPlot } from '../../src/compile';
test.each(fixture.cases)('matches independent Python results: $spec.type', ({ spec, expected }) => {
  const native = compileStatPlot(spec as any) as any;
  const actual =
    spec.type === 'correlationMatrix'
      ? native.series.flatMap((s: any) => s.data.values)
      : native.series.find((s: any) => s.id === (spec.type === 'learningCurve' ? 'scores' : 'estimates')).data.values;
  expect(actual).toHaveLength(expected.length);
  for (const row of expected) {
    const match = actual.find((a: any) =>
      spec.type === 'correlationMatrix'
        ? a.row === (row as any).row && a.column === (row as any).column
        : spec.type === 'learningCurve'
        ? a.trainSize === (row as any).trainSize && a.split === (row as any).split
        : a.category === (row as any).category
    );
    expect(match).toBeDefined();
    for (const [key, value] of Object.entries(row)) {
      if (typeof value === 'number') {
        expect(Math.abs(match[key] - value)).toBeLessThanOrEqual(fixture.absoluteTolerance);
      } else {
        expect(match[key]).toEqual(value);
      }
    }
  }
});
