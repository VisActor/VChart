import type { Page } from '@playwright/test';
import type { KdePlotSpec, EcdfPlotSpec } from '../../src/types';
import fs from 'fs';
import path from 'path';

export type DistributionSpec = KdePlotSpec | EcdfPlotSpec;
export const distributionOutput = path.resolve(__dirname, '../../../../.vchart-statplots/distributions');
fs.mkdirSync(distributionOutput, { recursive: true });

export async function renderDistribution(page: Page, spec: DistributionSpec) {
  await page.goto('/__tests__/browser/page.html');
  await page.evaluate(async spec => {
    const w = window as any;
    await w.renderStatPlot(spec);
    w.originalDistributionChart = w.chart;
  }, spec);
}
export async function updateDistribution(page: Page, spec: DistributionSpec) {
  await page.evaluate(async spec => {
    const w = window as any;
    await w.chart.updateSpec(w.VChartStatPlots.compileStatPlot(spec));
  }, spec);
}
export async function readDistribution(page: Page) {
  return page.evaluate(() => {
    const w = window as any;
    const series = w.chart.getChart().getAllSeries()[0];
    return {
      rows: w.chart.getSpec().series[0].data.values as {
        value: number;
        density?: number;
        cumulativeProbability?: number;
        series?: string;
      }[],
      lines: series
        .getMarkInName('line')
        .getGraphics()
        .map((g: any) => {
          const matrix = g.globalTransMatrix;
          return {
            curveType: g.attribute.curveType as string,
            stroke: g.attribute.stroke as string,
            points: g.attribute.points.map((p: any) => ({
              x: p.x as number,
              y: p.y as number,
              globalX: (matrix.a * p.x + matrix.c * p.y + matrix.e) as number,
              globalY: (matrix.b * p.x + matrix.d * p.y + matrix.f) as number
            })) as { x: number; y: number; globalX: number; globalY: number }[]
          };
        }) as {
        curveType: string;
        stroke: string;
        points: { x: number; y: number; globalX: number; globalY: number }[];
      }[],
      xDomain: series.getXAxisHelper().getScale(0).domain() as number[],
      yDomain: series.getYAxisHelper().getScale(0).domain() as number[],
      sameInstance: w.chart === (w.originalDistributionChart as boolean),
      errors: w.chartErrors as string[],
      labels: w.chart.getSpec().axes.map((axis: any) => axis.title.text) as string[],
      legends: w.chart
        .getStage()
        .findAll((g: any) => g.name === 'legendItemLabel', true)
        .map((g: any) => g.attribute.text) as string[]
    };
  });
}

export async function screenshotDistribution(page: Page, name: string, round: number) {
  await page.mouse.move(0, 0);
  await page.screenshot({ path: path.join(distributionOutput, `round-${round}-${name}.png`) });
}
