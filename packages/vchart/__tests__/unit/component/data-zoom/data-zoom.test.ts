import VChart, { type IBarChartSpec } from '../../../../src';
import type { DataZoom } from '../../../../src/component/data-zoom/data-zoom/data-zoom';
import type { IGroup, ILine } from '@visactor/vrender-core';
import { createDiv, removeDom } from '../../../util/dom';

type Row = { category: string; series: string; value: number };
const rows: Row[] = [
  { category: 'A', series: 'S', value: 10 },
  { category: 'B', series: 'S', value: 30 },
  { category: 'C', series: 'S', value: 20 }
];
const makeSpec = (values: Row[]): IBarChartSpec => ({
  type: 'bar',
  width: 500,
  height: 500,
  animation: false,
  xField: ['category'],
  yField: 'value',
  seriesField: 'series',
  data: [{ id: 'data', values }],
  dataZoom: [{ orient: 'bottom' }]
});

describe('DataZoom preview validity', () => {
  let dom: HTMLElement;
  let chart: VChart;
  beforeEach(() => {
    dom = createDiv();
  });
  afterEach(() => {
    chart?.release();
    removeDom(dom);
  });

  const zoom = (orient: 'bottom' | 'left') =>
    chart
      .getChart()
      .getAllComponents()
      .find(c => c.type === 'dataZoom' && c.getSpec().orient === orient) as DataZoom;
  const graphic = (orient: 'bottom' | 'left', name: string) =>
    (zoom(orient).getVRenderComponents()[0] as IGroup).find(n => n.name === name, true);
  const expectHidden = (orient: 'bottom' | 'left') => {
    for (const name of ['previewLine', 'previewArea']) {
      const node = graphic(orient, name);
      expect(!node || node.attribute.visible === false).toBe(true);
    }
  };
  const expectPreview = () => {
    const line = graphic('bottom', 'previewLine') as ILine;
    expect(line).toBeTruthy();
    expect(line.attribute.visible).not.toBe(false);
    expect(line.attribute.points.length).toBeGreaterThan(2);
    expect(line.attribute.points.every(p => Number.isFinite(p.x) && Number.isFinite(p.y))).toBe(true);
  };

  it('hides the degenerate vertical preview and keeps the horizontal preview', () => {
    const spec = makeSpec(rows);
    spec.dataZoom = [{ orient: 'bottom' }, { orient: 'left' }];
    chart = new VChart(spec, { dom, animation: false });
    chart.renderSync();
    expectHidden('left');
    expectPreview();
  });

  it.each(['spec', 'data'] as const)('restores preview after a single-row %s update', mode => {
    chart = new VChart(makeSpec([{ category: 'A', series: 'S', value: 333 }]), { dom, animation: false });
    chart.renderSync();
    expectHidden('bottom');
    if (mode === 'spec') {
      chart.updateSpecSync(makeSpec(rows));
    } else {
      chart.updateDataSync('data', rows);
    }
    expectPreview();
    const model = zoom('bottom');
    const viewData = () => chart.getChart().getAllSeries()[0].getViewData().latestData;
    model.setStartAndEnd(0, 0.4);
    expect(viewData().length).toBeLessThan(rows.length);
    model.setStartAndEnd(0.4, 1);
    model.setStartAndEnd(0, 1);
    expect(viewData().map((d: Row) => d.category)).toEqual(['A', 'B', 'C']);
    expectPreview();
  });
});
