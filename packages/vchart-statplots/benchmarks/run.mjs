import { performance } from 'node:perf_hooks';
import { createRequire } from 'node:module';
import fs from 'node:fs';
import { gzipSync } from 'node:zlib';
const require = createRequire(import.meta.url);
const { compileStatPlot, validateStatPlot } = require('../cjs/index.js');
const { layoutSwarm } = require('../cjs/series/swarm/layout.js');
const measure = (name, run) => {
  run();
  const timings = [];
  for (let i = 0; i < 9; i++) {
    const start = performance.now();
    run();
    timings.push(performance.now() - start);
  }
  timings.sort((a, b) => a - b);
  return { name, medianMs: timings[4], p95Ms: timings[8] };
};
const results = [];
for (const size of [10000, 50000]) {
  const spec = {
    type: 'rocCurve',
    data: Array.from({ length: size }, (_, i) => ({ actual: i % 3 === 0, score: i / (size - 1) }))
  };
  results.push(
    measure(`validate ROC ${size}`, () => validateStatPlot(spec)),
    measure(`compile ROC ${size}`, () => compileStatPlot(spec))
  );
}
for (const size of [1000, 10000]) {
  const points = Array.from({ length: size }, (_, i) => ({ id: String(i), valuePosition: i % 100, radius: 3.5 }));
  results.push(measure(`swarm ${size}`, () => layoutSwarm(points, 60)));
}
results.push(
  measure('swarm 10000 identical values', () =>
    layoutSwarm(
      Array.from({ length: 10000 }, (_, i) => ({ id: String(i), valuePosition: 0, radius: 3.5 })),
      60
    )
  )
);
const bundle = fs.readFileSync(new URL('../build/index.min.js', import.meta.url));
process.stdout.write(
  JSON.stringify(
    {
      node: process.version,
      platform: process.platform,
      arch: process.arch,
      generatedAt: new Date().toISOString(),
      bundleBytes: bundle.length,
      gzipBytes: gzipSync(bundle).length,
      results
    },
    null,
    2
  ) + '\n'
);
