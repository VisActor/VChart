import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

test('native themes control the rendered background, axes and more than six series colors', async ({ page }) => {
  await page.goto('/__tests__/browser/page.html');
  for (const theme of ['light', 'dark', 'light']) {
    const result = await page.evaluate(async theme => {
      const w = window as any;
      const spec = {
        type: 'scatterPlot',
        theme,
        colors: { categorical: 'vchart' },
        data: Array.from({ length: 7 }, (_, i) => ({ x: i, y: i + 1, series: `series-${i}` }))
      };
      if (w.chart) await w.chart.updateSpec(w.VChartStatPlots.compileStatPlot(spec));
      else await w.renderStatPlot(spec);
      const native = w.VChart.ThemeManager.getTheme(theme);
      const color = (key: string) => w.VChart.queryColorFromColorScheme(native.colorScheme, { type: 'palette', key });
      return {
        theme: w.chart.getSpec().theme,
        background: w.chart.getStage().background,
        expectedBackground: color('backgroundColor'),
        labels: w.chart
          .getStage()
          .findAll((g: any) => g.name === 'axis-label', true)
          .map((g: any) => g.attribute.fill),
        expectedLabel: color('axisLabelFontColor'),
        colors: w.chart
          .getChart()
          .getAllSeries()[0]
          .getSeriesMark()
          .getGraphics()
          .map((g: any) => g.attribute.fill),
        expectedColors: w.VChart.computeActualDataScheme(
          w.VChart.getDataScheme(native.colorScheme),
          spec.data.map(row => row.series)
        ).slice(0, 7),
        extraTheme: w.VChart.ThemeManager.themeExist(`statplots-${theme}`),
        errors: w.chartErrors
      };
    }, theme);
    expect(result.theme).toBe(theme);
    expect(result.background).toBe(result.expectedBackground);
    expect(result.labels.length).toBeGreaterThan(0);
    expect(result.labels.every((fill: string) => fill === result.expectedLabel)).toBe(true);
    expect(result.colors).toEqual(result.expectedColors);
    expect(new Set(result.colors).size).toBe(7);
    expect(result.extraTheme).toBe(false);
    expect(result.errors).toEqual([]);
  }
});

test('all 28 plots switch native themes and auxiliary colors follow the selected theme', async ({ page }) => {
  const directory = path.resolve(__dirname, '../../examples/specs');
  const specs = fs
    .readdirSync(directory)
    .filter(file => file.endsWith('.json') && file !== 'index.json')
    .map(file => JSON.parse(fs.readFileSync(path.join(directory, file), 'utf8')));
  expect(specs).toHaveLength(28);
  await page.goto('/__tests__/browser/page.html');
  for (const spec of specs) {
    for (const theme of ['light', 'dark']) {
      const result = await page.evaluate(
        async ({ spec, theme }) => {
          const w = window as any;
          const compiled = w.VChartStatPlots.compileStatPlot({ ...spec, theme });
          if (w.chart) await w.chart.updateSpec(compiled);
          else await w.renderStatPlot({ ...spec, theme });
          const scheme = w.VChart.ThemeManager.getTheme(theme).colorScheme;
          const color = (key: string) => w.VChart.queryColorFromColorScheme(scheme, { type: 'palette', key });
          const series = w.chart.getChart().getAllSeries();
          const marks = (id: string, name: string) =>
            series
              .find((s: any) => s.userId === id)
              .getMarkInName(name)
              .getGraphics();
          return {
            background: w.chart.getStage().background,
            expectedBackground: color('backgroundColor'),
            borders:
              spec.type === 'histogram'
                ? marks('histogram', 'bar').map((g: any) => g.attribute.stroke)
                : spec.type === 'hexbinPlot'
                ? series[0]
                    .getSeriesMark()
                    .getGraphics()
                    .map((g: any) => g.attribute.stroke)
                : [],
            missing:
              spec.type === 'correlationMatrix' ? marks('missing', 'cell').map((g: any) => g.attribute.fill) : [],
            expectedMissing: color('disableFontColor'),
            interval:
              spec.type === 'featureImportancePlot' ? marks('intervals', 'bar').map((g: any) => g.attribute.fill) : [],
            expectedInterval: color('primaryFontColor'),
            scree:
              spec.type === 'screePlot'
                ? [marks('variance', 'bar')[0].attribute.fill, marks('cumulative', 'line')[0].attribute.stroke]
                : [],
            errors: w.chartErrors
          };
        },
        { spec, theme }
      );
      expect(result.background, `${spec.type} ${theme}`).toBe(result.expectedBackground);
      expect(result.borders.every((value: string) => value === result.expectedBackground)).toBe(true);
      if (spec.type === 'correlationMatrix') {
        expect(result.missing).toHaveLength(3);
        expect(result.missing.every((value: string) => value === result.expectedMissing)).toBe(true);
      }
      if (spec.type === 'featureImportancePlot') {
        expect(result.interval.length).toBeGreaterThan(0);
        expect(result.interval.every((value: string) => value === result.expectedInterval)).toBe(true);
      }
      if (spec.type === 'screePlot') expect(new Set(result.scree).size).toBe(2);
      expect(result.errors).toEqual([]);
      if (
        [
          'violinPlot',
          'correlationMatrix',
          'featureImportancePlot',
          'hexbinPlot',
          'shapBeeswarmPlot',
          'screePlot'
        ].includes(spec.type)
      ) {
        await page.screenshot({
          path: path.resolve(__dirname, `../../../../.vchart-statplots/screenshots/native-${spec.type}-${theme}.png`)
        });
      }
    }
  }
});
