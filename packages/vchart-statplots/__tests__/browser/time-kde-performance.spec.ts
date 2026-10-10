import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';
const baseline = process.env.STATPLOTS_BASELINE === '1';
const output = path.resolve(__dirname, '../../../../.vchart-statplots/time-kde');
const scenarios = baseline
  ? ['kdePlot', 'violinPlot', 'time-estimates']
  : ['kdePlot', 'violinPlot', 'time-estimates', 'time-bootstrap', 'time-no-interval', 'time-direct'];
for (const scenario of scenarios)
  test(`${scenario}: 10k samples and chart lifecycle`, async ({ page }) => {
    await page.goto('/__tests__/browser/page.html');
    const result = await page.evaluate(
      async ({ scenario, baseline }) => {
        const w = window as any;
        let spec: any;
        if (scenario === 'kdePlot' || scenario === 'violinPlot')
          spec = {
            type: scenario,
            data: Array.from({ length: 10000 }, (_, i) => ({
              value: Math.sin(i * 0.7) + (i % 31) / 31,
              ...(scenario === 'kdePlot' ? { series: String(i % 4) } : { category: String(i % 20) })
            }))
          };
        else if (scenario === 'time-estimates')
          spec = {
            type: 'timeSeriesPlot',
            ...(baseline ? {} : { input: 'estimates' }),
            interval: { kind: 'confidence', level: 0.95 },
            data: Array.from({ length: 100 }, (_, i) => ({
              time: new Date(Date.UTC(2026, 0, 1) + i * 86400000).toISOString(),
              value: i,
              lower: i - 1,
              upper: i + 1
            }))
          };
        else
          spec = {
            type: 'timeSeriesPlot',
            input: 'observations',
            ...(scenario === 'time-direct'
              ? { estimator: false }
              : scenario === 'time-no-interval'
              ? { errorBar: false }
              : {}),
            data: Array.from({ length: 10000 }, (_, i) => ({
              time: new Date(Date.UTC(2026, 0, 1) + (i % 100) * 86400000).toISOString(),
              value: Math.sin(i * 0.7) + (i % 31) / 31
            }))
          };
        w.VChartStatPlots.registerStatPlots();
        const timings: number[] = [];
        w.VChartStatPlots.compileStatPlot(spec);
        let compiled;
        for (let i = 0; i < 5; i++) {
          const start = performance.now();
          compiled = w.VChartStatPlots.compileStatPlot(spec);
          timings.push(performance.now() - start);
        }
        const errors: string[] = [];
        const chart = new w.VChart.default(compiled, {
          dom: 'statplot-mount',
          autoFit: false,
          animation: false,
          onError: (e: any) => errors.push(String(e))
        });
        let start = performance.now();
        await chart.renderAsync();
        const renderMs = performance.now() - start;
        start = performance.now();
        await chart.updateSpec(w.VChartStatPlots.compileStatPlot({ ...spec, title: 'Updated' }));
        const updateMs = performance.now() - start;
        const before = JSON.stringify(chart.getSpec().series.map((s: any) => s.data.values));
        start = performance.now();
        await chart.resize(640, 480);
        const resizeMs = performance.now() - start;
        const unchanged = before === JSON.stringify(chart.getSpec().series.map((s: any) => s.data.values));
        const outputRows = chart.getSpec().series.at(-1).data.values.length;
        // hover 由浏览器事件路径触发，不重编译。
        const canvas = document.querySelector('canvas')!;
        start = performance.now();
        canvas.dispatchEvent(new MouseEvent('pointermove', { clientX: 320, clientY: 240, bubbles: true }));
        const hoverMs = performance.now() - start;
        start = performance.now();
        chart.release();
        const releaseMs = performance.now() - start;
        return {
          scenario,
          inputRows: spec.data.length,
          compileMs: timings,
          renderMs,
          updateMs,
          resizeMs,
          hoverMs,
          releaseMs,
          outputRows,
          unchanged,
          errors,
          canvases: document.querySelectorAll('canvas').length
        };
      },
      { scenario, baseline }
    );
    expect(result.errors).toEqual([]);
    expect(result.unchanged).toBe(true);
    expect(result.canvases).toBe(0);
    expect(result.outputRows).toBe(
      scenario === 'kdePlot' ? 1024 : scenario === 'violinPlot' ? 5120 : scenario === 'time-direct' ? 10000 : 100
    );
    fs.mkdirSync(output, { recursive: true });
    fs.writeFileSync(
      path.join(output, `${baseline ? 'before' : 'after'}-${scenario}.json`),
      JSON.stringify(result, null, 2)
    );
  });
