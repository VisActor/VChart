import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

test('measures equivalent native ROC and statplots ROC, and custom violin density geometry', async ({ page }) => {
  await page.goto('/__tests__/browser/page.html');
  const results = await page.evaluate(async () => {
    const w = window as any;
    w.VChartStatPlots.registerStatPlots();
    const roc = {
      type: 'rocCurve',
      data: Array.from({ length: 10000 }, (_, i) => ({ fpr: i / 9999, tpr: Math.sqrt(i / 9999) }))
    };
    const violin = {
      type: 'violinPlot',
      data: Array.from({ length: 10 }, (_, group) =>
        Array.from({ length: 1000 }, (_, i) => ({
          category: String(group),
          value: i / 100 - 5,
          density: Math.exp(-((i / 100 - 5) ** 2) / 2)
        }))
      ).flat()
    };
    const measure = async (build: () => any, name: string) => {
      let start = performance.now();
      const spec = build();
      const compileMs = performance.now() - start;
      const chart = new w.VChart.default(spec, {
        dom: 'statplot-mount',
        width: 800,
        height: 600,
        autoFit: false,
        animation: false
      });
      start = performance.now();
      await chart.renderAsync();
      const renderMs = performance.now() - start;
      start = performance.now();
      await chart.updateSpec({ ...spec, title: { text: 'Updated' } });
      const updateMs = performance.now() - start;
      start = performance.now();
      await chart.resize(600, 400);
      const resizeMs = performance.now() - start;
      start = performance.now();
      chart.release();
      const releaseMs = performance.now() - start;
      return { name, inputRows: 10000, compileMs, renderMs, updateMs, resizeMs, releaseMs };
    };
    const compiled = w.VChartStatPlots.compileStatPlot(roc);
    const native = () => ({
      ...compiled.series[0],
      type: 'line',
      theme: compiled.theme,
      axes: compiled.axes,
      padding: compiled.padding,
      markLine: compiled.markLine
    });
    // 先各暖机一次；原生和编译后的 ROC 使用相同轴、点、线、主题和画布尺寸。
    await measure(native, 'warmup');
    await measure(() => w.VChartStatPlots.compileStatPlot(roc), 'warmup');
    return [
      await measure(native, 'native ROC line'),
      await measure(() => w.VChartStatPlots.compileStatPlot(roc), 'statplots ROC'),
      await measure(() => w.VChartStatPlots.compileStatPlot(violin), 'violin 10 groups × 1000 density samples')
    ];
  });
  await expect(page.locator('canvas')).toHaveCount(0);
  fs.writeFileSync(
    path.resolve(__dirname, '../../../../.vchart-statplots/performance-comparison.json'),
    JSON.stringify(results, null, 2) + '\n'
  );
});
