import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const fixture = (type: string) =>
  JSON.parse(fs.readFileSync(path.resolve(__dirname, `../../examples/specs/${type}.json`), 'utf8'));
const custom = {
  categorical: ['#123456', '#CD762A'],
  sequential: ['#000000', '#FFFFFF', '#FF0000'],
  diverging: ['#0000FF', '#FFFFFF', '#FF0000']
};
const luminance = (hex: string) => {
  const rgb = [1, 3, 5]
    .map(i => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map(c => (c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)));
  return rgb[0] * 0.2126 + rgb[1] * 0.7152 + rgb[2] * 0.0722;
};

test('categorical palettes update real marks, cycle custom colors and restore native progressive colors', async ({
  page
}) => {
  await page.goto('/__tests__/browser/page.html');
  for (const theme of ['light', 'dark']) {
    for (const categorical of [undefined, 'deep', custom.categorical, 'vchart', undefined]) {
      const result = await page.evaluate(
        async ({ theme, categorical }) => {
          const w = window as any;
          const spec = {
            type: 'scatterPlot',
            theme,
            colors: categorical ? { categorical } : undefined,
            data: Array.from({ length: 12 }, (_, i) => ({ x: i, y: i, series: `S${i}` }))
          };
          if (w.chart) await w.chart.updateSpec(w.VChartStatPlots.compileStatPlot(spec));
          else await w.renderStatPlot(spec);
          return {
            fills: w.chart
              .getChart()
              .getAllSeries()[0]
              .getSeriesMark()
              .getGraphics()
              .map((g: any) => g.attribute.fill),
            native: w.VChart.computeActualDataScheme(
              w.VChart.getDataScheme(w.VChart.ThemeManager.getTheme(theme).colorScheme),
              spec.data.map(row => row.series)
            ),
            errors: w.chartErrors
          };
        },
        { theme, categorical }
      );
      const palette =
        categorical === 'vchart'
          ? result.native
          : Array.isArray(categorical)
          ? categorical
          : categorical === 'deep'
          ? [
              '#4C72B0',
              '#DD8452',
              '#55A868',
              '#C44E52',
              '#8172B3',
              '#937860',
              '#DA8BC3',
              '#8C8C8C',
              '#CCB974',
              '#64B5CD'
            ]
          : [
              '#0173B2',
              '#DE8F05',
              '#029E73',
              '#D55E00',
              '#CC78BC',
              '#CA9161',
              '#FBAFE4',
              '#949494',
              '#ECE133',
              '#56B4E9'
            ];
      expect(result.fills).toEqual(Array.from({ length: 12 }, (_, i) => palette[i % palette.length]));
      expect(result.errors).toEqual([]);
    }
  }
});

for (const type of ['correlationMatrix', 'confusionMatrix', 'hexbinPlot', 'shapBeeswarmPlot']) {
  test(`${type} keeps marks, color guide and color scale consistent across palette and theme updates`, async ({
    page
  }) => {
    await page.goto('/__tests__/browser/page.html');
    const base = fixture(type);
    if (type === 'correlationMatrix') {
      base.variables = ['A', 'B', 'C', 'missing'];
      base.data = {
        observations: Array.from({ length: 4 }, (_, i) => ({
          id: String(i),
          values: { A: i & 1 ? 1 : -1, B: i & 1 ? -1 : 1, C: i & 2 ? 1 : -1, missing: null }
        }))
      };
    }
    for (const theme of ['light', 'dark']) {
      for (const colors of [undefined, custom, { sequential: 'cividis' }]) {
        const result = await page.evaluate(
          async spec => {
            const w = window as any;
            if (w.chart) await w.chart.updateSpec(w.VChartStatPlots.compileStatPlot(spec));
            else await w.renderStatPlot(spec);
            const chart = w.chart.getChart();
            const colorSpec = w.chart.getSpec().scales[0];
            const scale = w.VChart.createScale('linear').domain(colorSpec.domain).range(colorSpec.range);
            const normalize = (color: string) => new w.VChart.Color(color).toHex().toUpperCase();
            const main = chart.getAllSeries().find((s: any) => !['missing', 'undefined'].includes(s.userId));
            const nativeScheme = w.VChart.ThemeManager.getTheme(spec.theme).colorScheme;
            const themeColor = (key: string) =>
              w.VChart.queryColorFromColorScheme(nativeScheme, { type: 'palette', key });
            const marks = main
              .getSeriesMark()
              .getGraphics()
              .map((g: any) => {
                const row = g.context.data[0];
                const value =
                  spec.type === 'correlationMatrix'
                    ? row.correlation
                    : spec.type === 'confusionMatrix'
                    ? row.value
                    : spec.type === 'hexbinPlot'
                    ? row.count
                    : row.__featureColor;
                const featureValues =
                  spec.type === 'shapBeeswarmPlot'
                    ? spec.data
                        .filter((r: any) => r.feature === row.feature && r.featureValue !== null)
                        .map((r: any) => r.featureValue)
                    : [];
                const constant = featureValues.length && Math.min(...featureValues) === Math.max(...featureValues);
                return {
                  actual: normalize(g.attribute.fill),
                  expected: normalize(
                    spec.type === 'shapBeeswarmPlot' && value === null
                      ? themeColor('disableFontColor')
                      : constant
                      ? themeColor('tertiaryFontColor')
                      : scale.scale(value)
                  )
                };
              });
            let colorGuide;
            if (spec.type === 'correlationMatrix' || spec.type === 'confusionMatrix') {
              const prefix = spec.type === 'correlationMatrix' ? 'correlation-colorbar' : 'confusion-colorbar';
              const rail = chart.getMarkByUserName(`${prefix}-rail`)[0].getGraphics()[0];
              const ticks = chart
                .getAllMarks()
                .filter((m: any) => m.name === `${prefix}-tick`)
                .flatMap((m: any) =>
                  m.getGraphics().map((g: any) => {
                    const text = String(g.attribute.text);
                    return parseFloat(text.replace('−', '-')) / (text.endsWith('%') ? 100 : 1);
                  })
                );
              colorGuide = {
                min: Math.min(...ticks),
                max: Math.max(...ticks),
                colors: rail.attribute.fill.stops.map((stop: any) => stop.color)
              };
            } else {
              const legend = chart
                .getAllComponents()
                .find((c: any) => c.type === 'colorLegend')
                .getVRenderComponents()[0];
              colorGuide = { min: legend.attribute.min, max: legend.attribute.max, colors: legend.attribute.colors };
            }
            const text = w.chart.getStage().findAll((g: any) => g.type === 'text', true);
            const labels = ['correlationMatrix', 'confusionMatrix'].includes(spec.type)
              ? chart.getAllSeries().flatMap((s: any) =>
                  s
                    .getSeriesMark()
                    .getGraphics()
                    .map((g: any) => {
                      const b = g.globalAABBBounds;
                      const cx = (b.x1 + b.x2) / 2,
                        cy = (b.y1 + b.y2) / 2;
                      const label = text.find((t: any) => {
                        const r = t.globalAABBBounds;
                        return Math.abs((r.x1 + r.x2) / 2 - cx) < 5 && Math.abs((r.y1 + r.y2) / 2 - cy) < 5;
                      });
                      return {
                        background: normalize(g.attribute.fill),
                        foreground: label ? normalize(label.attribute.fill) : null
                      };
                    })
                )
              : [];
            return {
              marks,
              labels,
              domain: colorSpec.domain,
              range: colorSpec.range,
              colorGuide,
              errors: w.chartErrors
            };
          },
          { ...base, theme, colors }
        );
        expect(result.marks.length).toBeGreaterThan(0);
        result.marks.forEach((mark: { actual: string; expected: string }) => expect(mark.actual).toBe(mark.expected));
        if (colors === custom) {
          expect(result.range).toEqual(type === 'correlationMatrix' ? custom.diverging : custom.sequential);
        }
        expect([result.colorGuide.min, result.colorGuide.max]).toEqual([
          result.domain[0],
          result.domain[result.domain.length - 1]
        ]);
        expect(result.colorGuide.colors).toEqual(result.range);
        if (type.includes('Matrix')) {
          expect(result.labels.length).toBeGreaterThan(0);
          for (const label of result.labels) {
            expect(label.foreground, `${type} ${theme} ${label.background}`).not.toBeNull();
            const a = luminance(label.background),
              b = luminance(label.foreground!);
            expect((Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05), JSON.stringify(label)).toBeGreaterThanOrEqual(
              4.5
            );
          }
        }
        expect(result.errors).toEqual([]);
        if (!colors)
          await page.screenshot({
            path: path.resolve(__dirname, `../../../../.vchart-statplots/colors-after/${type}-${theme}.png`)
          });
      }
    }
  });
}

test('gallery applies named palettes and recognizes custom arrays without losing theme or other roles', async ({
  page
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/examples/index.html?type=correlationMatrix');
  await expect(page.locator('#status')).toContainText('correlationMatrix ·');
  await page.locator('#color-sequential').selectOption('cividis');
  await expect(page.locator('#input')).toHaveValue(/"sequential": "cividis"/);
  await page.locator('#color-categorical').selectOption('deep');
  await page.locator('#theme').click();
  await expect(page.locator('#status')).toContainText('dark');
  let spec = JSON.parse(await page.locator('#input').inputValue());
  expect(spec.colors).toEqual({ sequential: 'cividis', categorical: 'deep' });
  spec.colors.diverging = custom.diverging;
  await page.locator('#input').fill(JSON.stringify(spec));
  await page.locator('#render').click();
  await expect(page.locator('#color-diverging')).toHaveValue('custom');
  await page.locator('#color-diverging').selectOption('RdBu_r');
  spec = JSON.parse(await page.locator('#input').inputValue());
  expect(spec.colors).toEqual({ sequential: 'cividis', categorical: 'deep', diverging: 'RdBu_r' });
  expect(spec.theme).toBe('dark');
  await expect(page.locator('#error')).toBeEmpty();
  // 图库保留 VChart 标签过渡；等待文字完全显现后留存视觉证据。
  await page.waitForFunction(() => {
    let ready = false;
    (window as any).VChart.default.InstanceManager.forEach((chart: any) => {
      const values = chart.getSpec().series.flatMap((series: any) => series.data.values);
      const labelTexts = new Set(
        values.map((row: any) => (row.correlation === null ? 'NA' : row.correlation.toFixed(2)))
      );
      const labels = chart.getStage().findAll((g: any) => g.type === 'text' && labelTexts.has(g.attribute.text), true);
      ready =
        labels.length === 6 &&
        labels.every((g: any) => (g.attribute.opacity ?? 1) === 1 && (g.attribute.fillOpacity ?? 1) === 1);
    });
    return ready;
  });
  await page.screenshot({
    path: path.resolve(__dirname, '../../../../.vchart-statplots/colors-after/gallery.png'),
    fullPage: true
  });
  spec.colors.categorical = [null];
  await page.locator('#input').fill(JSON.stringify(spec));
  await page.locator('#render').click();
  await expect(page.locator('#error')).toContainText('/colors/categorical/0');
});
