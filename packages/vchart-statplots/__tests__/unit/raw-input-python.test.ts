import fs from 'fs';
import path from 'path';
import { compileStatPlot } from '../../src/compile';
import { normalQuantile } from '@visactor/vutils';
const fixture = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../fixtures/raw-input-python.json'), 'utf8'));
for (const [index, { spec, expected }] of fixture.cases.entries())
  test(`matches Python fixture ${index}: ${spec.type}`, () => {
    const chart = compileStatPlot(spec) as any;
    const rows = chart.series.find((s: any) => ['roc', 'pr', 'calibration', 'quantiles', 'values'].includes(s.id))?.data
      .values;
    expect(rows).toBeDefined();
    if (spec.type === 'autocorrelationPlot') {
      expect(rows).toHaveLength(expected.correlations.length);
      rows.forEach((r: any, i: number) => {
        expect(r.correlation).toBeCloseTo(expected.correlations[i], 12);
        if (i) expect(Math.abs(r.upper - expected.widths[i])).toBeLessThan(fixture.absoluteTolerance);
        else expect(r.upper).toBeUndefined();
      });
    } else {
      const fields =
        spec.type === 'rocCurve'
          ? ['fpr', 'tpr']
          : spec.type === 'precisionRecallCurve'
          ? ['recall', 'precision']
          : spec.type === 'calibrationCurve'
          ? ['meanPredictedProbability', 'observedRate']
          : ['theoreticalQuantile', 'sampleQuantile'];
      expect(rows).toHaveLength(expected.points.length);
      rows.forEach((r: any, i: number) =>
        fields.forEach((f, j) => expect(Math.abs(r[f] - expected.points[i][j])).toBeLessThan(fixture.absoluteTolerance))
      );
      if (expected.metric !== undefined) {
        expect(rows[0][spec.type === 'rocCurve' ? 'auc' : 'averagePrecision']).toBeCloseTo(expected.metric, 12);
        expect(rows.map((r: any) => r.threshold ?? null)).toEqual(expected.thresholds);
      }
    }
  });
test('public normal inverse CDF matches scipy at tails and branch boundaries', () => {
  for (const [p, expected] of fixture.normalQuantiles)
    expect(Math.abs(normalQuantile(p) - expected)).toBeLessThan(fixture.absoluteTolerance);
});
