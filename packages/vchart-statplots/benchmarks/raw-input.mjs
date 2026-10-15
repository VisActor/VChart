import { createRequire } from 'module';
import { performance } from 'perf_hooks';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const { compileStatPlot, validateStatPlot } = createRequire(import.meta.url)('../cjs');
export function rawSpec(type, n, options = {}) {
  const data = Array.from({ length: n }, (_, i) =>
    type === 'countPlot'
      ? { category: String(i % 7) }
      : type === 'confusionMatrix'
      ? { actual: String(i % 5), predicted: String((i * 7 + 1) % 5) }
      : type === 'rocCurve' || type === 'precisionRecallCurve'
      ? { actual: i % 3 === 0, score: ((i * 7919) % n) / n }
      : type === 'calibrationCurve'
      ? { actual: i % 3 === 0, probability: ((i * 7919) % n) / n }
      : { value: Math.sin(i * 0.7) + (i % 31) / 31 }
  );
  return { type, data, ...options };
}
const scenarios = [];
for (const n of [10000, 100000]) {
  for (const type of [
    'countPlot',
    'confusionMatrix',
    'rocCurve',
    'precisionRecallCurve',
    'calibrationCurve',
    'qqPlot',
    'autocorrelationPlot'
  ])
    scenarios.push(rawSpec(type, n));
  scenarios.push(rawSpec('autocorrelationPlot', n, { maxLag: 512 }));
  scenarios.push(rawSpec('autocorrelationPlot', n, { method: 'pacf', maxLag: 512 }));
  const tied = rawSpec('precisionRecallCurve', n);
  tied.data.forEach(r => (r.score = Math.floor(r.score * 16)));
  scenarios.push(tied);
}
const results = scenarios.map(spec => {
  compileStatPlot(spec);
  const samples = [];
  const validation = [];
  for (let i = 0; i < 9; i++) {
    let start = performance.now();
    if (!validateStatPlot(spec).valid) throw Error('invalid benchmark');
    validation.push(performance.now() - start);
    start = performance.now();
    const chart = compileStatPlot(spec);
    samples.push(performance.now() - start);
    if (chart.series.every(s => s.data.values.length === 0)) throw Error('missing output');
  }
  samples.sort((a, b) => a - b);
  validation.sort((a, b) => a - b);
  return {
    type: spec.type,
    inputRows: spec.data.length,
    method: spec.method ?? null,
    maxLag: spec.maxLag ?? null,
    tiedScores: spec.type === 'precisionRecallCurve' && new Set(spec.data.map(r => r.score)).size < spec.data.length,
    compileMedianMs: samples[4],
    compileMaxMs: samples[8],
    validateMedianMs: validation[4]
  };
});
fs.writeFileSync(
  path.join(root, 'benchmarks/raw-input-results.json'),
  JSON.stringify({ node: process.version, repetitions: 9, results }, null, 2) + '\n'
);
console.log(JSON.stringify(results, null, 2));
