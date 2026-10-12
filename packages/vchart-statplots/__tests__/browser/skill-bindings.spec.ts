import { test, expect } from '@playwright/test';
import path from 'path';
const bindings: Record<string, any> = {
  countPlot: { category: 'group' },
  histogram: { value: 'x' },
  kdePlot: { value: 'x' },
  ecdfPlot: { value: 'x' },
  boxPlot: { category: 'group', value: 'x' },
  violinPlot: { category: 'group', value: 'x' },
  stripPlot: { category: 'group', value: 'x' },
  scatterPlot: { x: 'x', y: 'y' },
  hexbinPlot: { x: 'x', y: 'y' },
  missingValueMatrix: { variables: ['x', 'group'] },
  correlationMatrix: { variables: ['x', 'y'] },
  pairPlot: { variables: ['x', 'y'] }
};
for (const [type, fields] of Object.entries(bindings)) {
  test(`skill table binding renders ${type} with real public APIs`, async ({ page }) => {
    await page.goto('/__tests__/browser/page.html');
    await page.addScriptTag({
      path: path.resolve(__dirname, '../../../../skills/data-science-visualization/assets/data-bindings.js')
    });
    const result = await page.evaluate(
      async ({ type, fields }) => {
        const rows = [
          { id: '001', values: { x: 0, y: 1, group: 'A' } },
          { id: '002', values: { x: null, y: 2, group: 'A' } },
          { id: '003', values: { x: 2, y: 3, group: 'B' } },
          { id: '004', values: { x: 4, y: 4, group: 'B' } },
          { id: '005', values: { x: 1, y: 0, group: 'A' } }
        ];
        const columns = [
          { name: 'x', type: 'number' },
          { name: 'y', type: 'number' },
          { name: 'group', type: 'string' }
        ];
        const built = (window as any).StatPlotData.buildBoundSpec({ type, fields }, rows, columns);
        const valid = (window as any).VChartStatPlots.validateStatPlot(built.spec);
        if (valid.valid) await (window as any).renderStatPlot(built.spec);
        return { valid, inputN: built.inputN, omittedN: built.omittedN };
      },
      { type, fields }
    );
    expect(result.valid).toEqual({ valid: true, errors: [] });
    expect(result.inputN + result.omittedN).toBe(5);
    await expect(page.locator('#statplot-mount canvas')).toHaveCount(1);
    expect(
      await page.evaluate(() =>
        (window as any).chart
          .getChart()
          .getAllSeries()
          .some((s: any) => s.getSeriesMark().getGraphics().length > 0)
      )
    ).toBe(true);
  });
}
