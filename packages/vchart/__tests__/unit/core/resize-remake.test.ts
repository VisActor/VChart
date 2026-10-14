import VChart from '../../../src';
import type { IBarChartSpec } from '../../../src';
import { createDiv, removeDom } from '../../util/dom';

const makeSpec = (custom = false): IBarChartSpec => ({
  type: 'bar',
  data: { id: 'data', values: [{ category: 'A', value: 1 }] },
  xField: 'category',
  yField: 'value',
  ...(custom ? { customMark: [{ type: 'text' as const, style: { text: '重建', x: 20, y: 20 } }] } : {})
});

test('new explicit spec dimensions override the saved manual size', () => {
  const dom = createDiv();
  const chart = new VChart(makeSpec(), { dom, autoFit: false, animation: false });
  try {
    chart.renderSync();
    chart.resizeSync(420, 360);
    chart.updateSpecSync({ ...makeSpec(true), width: 640, height: 480 });
    expect(chart.getChart()!.getCanvasRect()).toEqual({ width: 640, height: 480 });
    expect(chart.getStage()!.width).toBe(640);
    expect(chart.getStage()!.height).toBe(480);
  } finally {
    chart.release();
    removeDom(dom);
  }
});

test('manual resize survives spec remakes and keeps the chart and stage at the same size', () => {
  const dom = createDiv();
  const chart = new VChart(makeSpec(), { dom, autoFit: false, animation: false });
  try {
    chart.renderSync();
    chart.resizeSync(420, 360);
    const original = chart.getChart();
    chart.updateSpecSync(makeSpec(true));
    expect(chart.getChart()).not.toBe(original);
    expect(chart.getChart()!.getCanvasRect()).toEqual({ width: 420, height: 360 });
    expect(chart.getStage()!.width).toBe(420);
    expect(chart.getStage()!.height).toBe(360);
    chart.resizeSync(800, 600);
    chart.updateSpecSync(makeSpec());
    expect(chart.getChart()!.getCanvasRect()).toEqual({ width: 800, height: 600 });
    expect(chart.getStage()!.width).toBe(800);
    expect(chart.getStage()!.height).toBe(600);
  } finally {
    chart.release();
    removeDom(dom);
  }
});
