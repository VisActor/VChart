import VChart, { type IScatterChartSpec } from '../../../../src';
import type { DataZoom } from '../../../../src/component/data-zoom/data-zoom/data-zoom';
import type { ScrollBar } from '../../../../src/component/data-zoom/scroll-bar/scroll-bar';
import type { CartesianAxis } from '../../../../src/component/axis/cartesian';
import type { IContinuousScale } from '@visactor/vscale';
import { createDiv, removeDom } from '../../../util/dom';

const rows = (xs = [0, 20, 40, 60, 80, 100]) => xs.map((x, y) => ({ x, y: y + 1 }));

describe.each(['dataZoom', 'scrollBar'] as const)('%s effective filter mode', key => {
  let chart: VChart;
  let dom: HTMLElement;
  const component = () =>
    chart
      .getChart()
      .getAllComponents()
      .find(c => c.type === key) as DataZoom | ScrollBar;
  const axis = () =>
    chart
      .getChart()
      .getAllComponents()
      .find(c => c.getSpec().id === 'x') as CartesianAxis;
  const visible = () =>
    chart
      .getChart()
      .getAllSeries()[0]
      .getViewData()
      .latestData.map((d: { x: number }) => d.x);
  const create = (options: { filterMode?: 'axis' | 'filter'; axisId?: string }) => {
    chart = new VChart(
      {
        type: 'scatter',
        animation: false,
        data: { id: 'data', values: rows() },
        xField: 'x',
        yField: 'y',
        axes: [{ id: 'x', orient: 'bottom', type: 'linear', nice: false, zero: false }, { orient: 'left' }],
        [key]: [{ orient: 'bottom', field: 'x', start: 0.1, endValue: 40, ...options }]
      } as IScatterChartSpec,
      { dom, animation: false }
    );
    chart.renderSync();
  };
  beforeEach(() => {
    dom = createDiv();
  });
  afterEach(() => {
    chart?.release();
    removeDom(dom);
  });

  it.each(['axis', 'filter', undefined] as const)('filters an unbound field with requested mode %s', filterMode => {
    create({ filterMode });
    expect(visible()).toEqual([20, 40]);
    expect(axis().getScale().domain()).toEqual([20, 40]);
    // 相同百分比在新数据域下对应不同值，必须重新计算筛选域。
    chart.updateDataSync('data', rows([0, 20, 40, 60, 80, 100, 300]));
    expect(visible()).toEqual([40]);
    chart.updateDataSync('data', []);
    chart.updateDataSync('data', rows());
    expect(visible()).toEqual([20, 40]);
  });

  it('reports data filtering for field-based interactions and retains the selected window', () => {
    create({ filterMode: 'axis' });
    const onChange = jest.fn();
    chart.on(key === 'dataZoom' ? 'dataZoomChange' : 'scrollBarChange', onChange);
    component().setStartAndEnd(0.5, 1);
    expect(visible()).toEqual([60, 80, 100]);
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ value: expect.objectContaining({ filterData: true }) })
    );
    chart.updateDataSync('data', rows([0, 20, 40, 60, 80, 100, 200]));
    expect(visible()).toEqual([100, 200]);
  });

  it('keeps axis mode when an axis is explicitly bound alongside the field', () => {
    create({ filterMode: 'axis', axisId: 'x' });
    expect(visible()).toEqual([0, 20, 40, 60, 80, 100]);
    const range = (axis().getScale() as IContinuousScale).rangeFactor();
    expect(range[0]).toBeCloseTo(0.1);
    expect(range[1]).toBeCloseTo(0.4);
    const onChange = jest.fn();
    chart.on(key === 'dataZoom' ? 'dataZoomChange' : 'scrollBarChange', onChange);
    component().setStartAndEnd(0.5, 1);
    expect(visible()).toEqual([0, 20, 40, 60, 80, 100]);
    expect((axis().getScale() as IContinuousScale).rangeFactor()).toEqual([0.5, 1]);
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ value: expect.objectContaining({ filterData: false }) })
    );
  });
});
