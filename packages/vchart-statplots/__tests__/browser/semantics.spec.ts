import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';
const fixture = (type: string) =>
  JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../examples/specs', `${type}.json`), 'utf8'));
async function render(page: any, spec: any) {
  await page.goto('/__tests__/browser/page.html');
  await page.evaluate(async (spec: any) => {
    await (window as any).renderStatPlot(spec);
  }, spec);
}
async function marks(page: any) {
  return page.evaluate(() =>
    (window as any).chart
      .getChart()
      .getAllSeries()
      .map((s: any) => ({
        id: s.userId,
        rect: s.getRegion().getLayoutRect(),
        marks: s.getMarks().flatMap((m: any) =>
          m.getGraphics().map((g: any) => ({
            name: m.name,
            type: g.type,
            points: g.attribute.points,
            x: g.attribute.x,
            y: g.attribute.y,
            w: g.AABBBounds.width(),
            h: g.AABBBounds.height(),
            datum: g.context?.data?.[0],
            states: g.currentStates
          }))
        )
      }))
  );
}
test('time gaps break both curve and band, and ACF stems reach zero', async ({ page }) => {
  await render(page, fixture('timeSeriesPlot'));
  const time = await marks(page);
  const band = time.find((s: any) => s.id === 'uncertainty').marks.find((m: any) => m.name === 'area');
  const line = time.find((s: any) => s.id === 'observations').marks.find((m: any) => m.name === 'line');
  expect(band.points[4].defined).toBe(false);
  expect(line.points[4].defined).toBe(false);
  await render(page, fixture('autocorrelationPlot'));
  const acf = await marks(page);
  const stems = acf.find((s: any) => s.id === 'stems').marks.filter((m: any) => m.name === 'line');
  expect(stems).toHaveLength(12);
  for (const stem of stems) {
    expect(stem.points).toHaveLength(2);
    expect(stem.points[0].x).toBeCloseTo(stem.points[1].x, 5);
    expect(stem.points[0].y).toBeCloseTo(stems[0].points[0].y, 5);
  }
});
test('seasonal subseries use the same numerical domain and substantial panel height', async ({ page }) => {
  await render(page, fixture('seasonalPlot'));
  const result = await page.evaluate(() =>
    (window as any).chart
      .getChart()
      .getAllSeries()
      .map((s: any) => ({
        domain: s.getYAxisHelper().getScale(0).domain(),
        height: s.getRegion().getLayoutRect().height
      }))
  );
  expect(result).toHaveLength(4);
  for (const item of result) {
    expect(item.domain).toEqual(result[0].domain);
    expect(item.height).toBeGreaterThan(350);
  }
});
test('hexbin preserves all six vertices through resize', async ({ page }) => {
  const spec = fixture('hexbinPlot');
  await render(page, spec);
  for (const size of [null, [420, 320]]) {
    if (size) {
      await page.evaluate(async size => {
        await (window as any).chart.resize(size[0], size[1]);
      }, size);
    }
    const polygons = (await marks(page))[0].marks.filter((m: any) => m.type === 'polygon');
    expect(polygons).toHaveLength(spec.data.length);
    for (const polygon of polygons) {
      expect(polygon.points).toHaveLength(6);
      expect(polygon.points.every((p: any) => Number.isFinite(p.x) && Number.isFinite(p.y))).toBe(true);
    }
  }
});
test('swarm avoids collisions in pixel space after resize and preserves values', async ({ page }) => {
  const spec = {
    type: 'stripPlot',
    layout: 'swarm',
    data: Array.from({ length: 35 }, (_, i) => ({ id: String(i), category: 'A', value: i % 7 }))
  };
  await render(page, spec);
  for (const size of [null, [420, 320]]) {
    if (size) {
      await page.evaluate(async size => {
        await (window as any).chart.resize(size[0], size[1]);
      }, size);
    }
    const points = (await marks(page))[0].marks.filter((m: any) => m.name === 'point');
    expect(points).toHaveLength(35);
    for (let i = 0; i < points.length; i++) {
      expect(points[i].datum.value).toBe(spec.data.find(r => r.id === points[i].datum.id)!.value);
      for (let j = 0; j < i; j++) {
        expect((points[i].x - points[j].x) ** 2 + (points[i].y - points[j].y) ** 2).toBeGreaterThanOrEqual(49);
      }
    }
  }
});
test('pair plot brush links observation ids across panels with different positions', async ({ page }) => {
  await render(page, fixture('pairPlot'));
  let previous: string[] = [];
  for (const id of ['1', '2']) {
    if (id === '2') {
      await page.evaluate(async () => {
        await (window as any).chart.resize(720, 540);
      });
    }
    const target = await page.evaluate(id => {
      const series = (window as any).chart
        .getChart()
        .getAllSeries()
        .find((s: any) => s.userId === 'scatter-0-1');
      const point = series
        .getSeriesMark()
        .getGraphics()
        .find((g: any) => g.context.data[0].id === id);
      const b = point.globalAABBBounds;
      return { x: (b.x1 + b.x2) / 2, y: (b.y1 + b.y2) / 2 };
    }, id);
    await page.mouse.move(target.x - 8, target.y - 8);
    await page.mouse.down();
    await page.mouse.move(target.x + 8, target.y + 8, { steps: 8 });
    await page.mouse.up();
    const result = await page.evaluate(() =>
      (window as any).chart
        .getChart()
        .getAllSeries()
        .filter((s: any) => s.userId.startsWith('scatter'))
        .map((s: any) => ({
          id: s.userId,
          selected: s
            .getSeriesMark()
            .getGraphics()
            .filter((g: any) => g.hasState('inBrush'))
            .map((g: any) => g.context.data[0].id)
            .sort()
        }))
    );
    const selected = result.find((r: any) => r.id === 'scatter-0-1').selected;
    expect(selected).toContain(id);
    expect(selected).not.toEqual(previous);
    previous = selected;
    expect(selected.length).toBeLessThan(10);
    for (const panel of result) {
      expect(panel.selected).toEqual(selected);
    }
  }
  await page.evaluate(() => (window as any).chart.release());
  await expect(page.locator('canvas')).toHaveCount(0);
});
test('interval caps and diverging legend have the promised geometry', async ({ page }) => {
  await render(page, fixture('pointIntervalPlot'));
  const caps = (await marks(page)).find((s: any) => s.id === 'caps').marks.filter((m: any) => m.name === 'point');
  expect(caps).toHaveLength(4);
  caps.forEach((cap: any) => {
    expect(cap.h).toBeGreaterThanOrEqual(9);
    expect(cap.w).toBeLessThan(4);
  });
  await render(page, fixture('correlationMatrix'));
  expect(
    await page.evaluate(() => {
      const legend = (window as any).chart
        .getChart()
        .getAllComponents()
        .find((c: any) => c.type === 'colorLegend')
        .getVRenderComponents()[0];
      return [legend.attribute.min, legend.attribute.max];
    })
  ).toEqual([-1, 1]);
});
test('violin tooltip describes the density group and legend filters entire groups', async ({ page }) => {
  await render(page, fixture('violinPlot'));
  const center = await page.evaluate(() => {
    const series = (window as any).chart.getChart().getAllSeries()[0];
    const graphic = series.getSeriesMark().getGraphics()[0];
    const b = graphic.globalAABBBounds;
    return { x: (b.x1 + b.x2) / 2, y: (b.y1 + b.y2) / 2 };
  });
  await page.mouse.move(center.x, center.y);
  await expect(page.locator('.vchart-tooltip-element')).toBeVisible();
  const text = await page.locator('.vchart-tooltip-element').innerText();
  expect(text).toContain('概率密度');
  expect(text).toContain('采样下界');
  expect(text).toContain('峰值');
  expect(text).toContain('-3.5');
  const legend = await page.evaluate(() => {
    const component = (window as any).chart
      .getChart()
      .getAllComponents()
      .find((c: any) => c.type === 'discreteLegend')
      .getVRenderComponents()[0];
    const items: any[] = [];
    component.forEachChildren((g: any) => items.push(g), true);
    const item = (window as any).chart.getStage().find((g: any) => g.name === 'legendItem', true);
    const b = item.globalAABBBounds;
    return { x: (b.x1 + b.x2) / 2, y: (b.y1 + b.y2) / 2 };
  });
  await page.mouse.click(legend.x, legend.y);
  await expect
    .poll(() =>
      page.evaluate(() => (window as any).chart.getChart().getAllSeries()[0].getSeriesMark().getGraphics().length)
    )
    .toBe(2);
});
test('box plots include whiskers and outliers in the axis domain, and reference lines are drawn', async ({ page }) => {
  await render(page, fixture('boxPlot'));
  const box = await page.evaluate(() => {
    const series = (window as any).chart.getChart().getAllSeries()[0];
    return {
      domain: series.getYAxisHelper().getScale(0).domain(),
      outliers: series
        .getMarks()
        .find((m: any) => m.name === 'outlier')
        .getGraphics()
        .map((g: any) => g.attribute.y)
    };
  });
  expect(box.domain[0]).toBeLessThanOrEqual(-3);
  expect(box.domain[1]).toBeGreaterThanOrEqual(3.5);
  expect(box.outliers).toHaveLength(3);
  expect(new Set(box.outliers).size).toBe(3);
  for (const type of ['calibrationCurve', 'qqPlot']) {
    await render(page, fixture(type));
    const geometry = await page.evaluate(() => {
      const marker = (window as any).chart
        .getChart()
        .getAllComponents()
        .find((c: any) => c.type === 'markLine')
        .getVRenderComponents()[0];
      return marker.findAll((g: any) => g.type === 'line', true).flatMap((g: any) => g.attribute.points ?? []);
    });
    expect(geometry.length).toBeGreaterThanOrEqual(2);
    expect(geometry.every((p: any) => Number.isFinite(p.x) && Number.isFinite(p.y))).toBe(true);
    expect(new Set(geometry.map((p: any) => p.x)).size).toBeGreaterThan(1);
  }
});

test('seasonal panels show cycles in the declared order and break missing cycles', async ({ page }) => {
  const spec = fixture('seasonalPlot');
  spec.cycleOrder = ['2026', '2025', '2024'];
  spec.data = spec.data.filter((row: any) => row.phase !== 'Q2' || row.cycle !== '2025').reverse();
  await render(page, spec);
  for (const size of [null, [900, 600]]) {
    if (size)
      await page.evaluate(async size => {
        await (window as any).chart.resize(size[0], size[1]);
      }, size);
    const result = await page.evaluate(() =>
      (window as any).chart
        .getChart()
        .getAllSeries()
        .map((s: any) => ({
          xDomain: s.getXAxisHelper().getScale(0).domain(),
          points: s
            .getMarkInName('line')
            .getGraphics()[0]
            .attribute.points.map((p: any) => ({ x: p.x, defined: p.defined })),
          phase: s.getSeriesMark().getGraphics()[0].context.data[0].phase
        }))
    );
    expect(result).toHaveLength(4);
    result.forEach((panel: any, i: number) => {
      expect(panel.xDomain).toEqual(spec.cycleOrder);
      expect(panel.phase).toBe(spec.phaseOrder[i]);
      expect(panel.points).toHaveLength(3);
      expect(panel.points[0].x).toBeLessThan(panel.points[2].x);
    });
    expect(result[1].points[1].defined).toBe(false);
  }
  await page.screenshot({
    path: path.resolve(__dirname, '../../../../.vchart-statplots/naming-after/seasonal-subseries.png')
  });
});

test('fieldLabels appear on the rendered axes and the real hover tooltip', async ({ page }) => {
  await render(page, {
    type: 'countPlot',
    statistic: 'proportion',
    fieldLabels: { category: '客户类型', count: '客户数', proportion: '客户占比' },
    data: [
      { category: 'A', count: 3 },
      { category: 'B', count: 7 }
    ]
  });
  const texts = await page.evaluate(() =>
    (window as any).chart
      .getStage()
      .findAll((g: any) => g.type === 'text', true)
      .map((g: any) => String(g.attribute.text))
  );
  expect(texts).toContain('客户类型');
  expect(texts).toContain('客户占比');
  const target = await page.evaluate(() => {
    const g = (window as any).chart.getChart().getAllSeries()[0].getSeriesMark().getGraphics()[0];
    const b = g.globalAABBBounds;
    return { x: (b.x1 + b.x2) / 2, y: (b.y1 + b.y2) / 2 };
  });
  await page.mouse.move(target.x, target.y);
  await expect(page.locator('.vchart-tooltip-element')).toContainText('客户占比');
  await expect(page.locator('.vchart-tooltip-element')).toContainText('客户数');
  await page.screenshot({
    path: path.resolve(__dirname, '../../../../.vchart-statplots/naming-after/field-labels.png')
  });
});
test('seasonal overlay keeps distinct series-cycle pairs as separate lines', async ({ page }) => {
  await render(page, {
    type: 'seasonalPlot',
    cycleOrder: ['B / C', 'C'],
    phaseOrder: ['Q1', 'Q2'],
    data: [
      { series: 'A', cycle: 'B / C', phase: 'Q1', value: 1 },
      { series: 'A', cycle: 'B / C', phase: 'Q2', value: 2 },
      { series: 'A / B', cycle: 'C', phase: 'Q1', value: 3 },
      { series: 'A / B', cycle: 'C', phase: 'Q2', value: 4 }
    ]
  });
  const lines = await page.evaluate(() =>
    (window as any).chart
      .getChart()
      .getAllSeries()[0]
      .getMarkInName('line')
      .getGraphics()
      .map((g: any) => g.attribute.points.length)
  );
  expect(lines).toEqual([2, 2]);
  const labels = await page.evaluate(() =>
    (window as any).chart
      .getStage()
      .findAll((g: any) => g.name === 'legendItemLabel', true)
      .map((g: any) => g.attribute.text)
  );
  expect(labels).toEqual(['A / B / C', 'A / B / C']);
});
