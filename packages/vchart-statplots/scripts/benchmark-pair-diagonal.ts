import { performance } from 'perf_hooks';
import { preparePairDistributions } from '../src/plots/pair-plot/binning';

const results = [4, 8].map(variables => {
  const names = Array.from({ length: variables }, (_, i) => `v${i + 1}`);
  const rows = Array.from({ length: 10000 }, (_, i) => ({
    id: String(i),
    values: Object.fromEntries(names.map((name, j) => [name, ((i * (j * 2 + 1)) % 997) / 997]))
  }));
  preparePairDistributions(rows, names, { enabled: true });
  const measurementsMs = Array.from({ length: 10 }, () => {
    const start = performance.now();
    const result = preparePairDistributions(rows, names, { enabled: true });
    const duration = performance.now() - start;
    if (!result.every(variable => variable.bins.reduce((sum, b) => sum + b.count, 0) === rows.length)) {
      throw new Error('分箱计数不守恒');
    }
    return duration;
  });
  const sorted = measurementsMs.slice().sort((a, b) => a - b);
  return {
    variables,
    observations: rows.length,
    warmup: 1,
    repetitions: 10,
    measurementsMs,
    medianMs: (sorted[4] + sorted[5]) / 2,
    countConservation: true
  };
});
// eslint-disable-next-line no-console
console.log(
  JSON.stringify({ node: process.version, platform: process.platform, arch: process.arch, results }, null, 2)
);
