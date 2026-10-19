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

  it('keeps numeric categories in axis order when the same field also has continuous statistics', () => {
    chart = new VChart(
      {
        type: 'bar',
        width: 500,
        height: 500,
        animation: false,
        xField: 'value',
        yField: 'value',
        data: { id: 'data', values: [{ value: 3 }, { value: 1 }, { value: 2 }] },
        axes: [
          { orient: 'bottom', type: 'band' },
          { orient: 'left', type: 'linear' }
        ],
        dataZoom: [{ orient: 'bottom', filterMode: 'axis' }]
      },
      { dom, animation: false }
    );
    chart.renderSync();
    const model = zoom('bottom');
    const previewValues = () =>
      model
        .getData()
        .getLatestData()
        .map((d: { x: number }) => d.x);
    expect(previewValues()).toEqual([3, 1, 2]);
    model.setStartAndEnd(0, 0.5);
    expect(model.stateScale.domain()).toEqual([3, 1, 2]);
    model.setStartAndEnd(0, 1);
    chart.updateDataSync('data', [{ value: 6 }, { value: 4 }, { value: 5 }]);
    expect(previewValues()).toEqual([6, 4, 5]);
    expect(model.stateScale.domain()).toEqual([6, 4, 5]);
  });

  it('does not collect discrete values for a continuous DataZoom axis on data updates', () => {
    chart = new VChart(
      {
        type: 'scatter',
        width: 500,
        height: 500,
        animation: false,
        xField: 'x',
        yField: 'y',
        data: { id: 'data', values: [{ x: 1, y: 1 }] },
        axes: [
          { orient: 'bottom', type: 'linear' },
          { orient: 'left', type: 'linear' }
        ],
        dataZoom: [{ orient: 'bottom' }]
      },
      { dom, animation: false }
    );
    chart.renderSync();
    const series = chart.getChart().getAllSeries()[0];
    const statistics = jest.spyOn(series, 'getRawDataStatisticsByField');
    chart.updateDataSync(
      'data',
      Array.from({ length: 10000 }, (_, x) => ({ x, y: x % 100 }))
    );
    const xCalls = statistics.mock.calls.filter(([field]) => String(field) === 'x');
    expect(xCalls.length).toBeGreaterThan(0);
    expect(xCalls.every(([, isNumeric]) => isNumeric === true)).toBe(true);
    expect(series.getRawDataStatisticsByField('x', true).values).toBeUndefined();
    expect(zoom('bottom').stateScale.domain()).toEqual([0, 9999]);
    statistics.mockRestore();
  });
});
