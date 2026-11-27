import VChart from '../../../../src';
import type { DataZoom } from '../../../../src/component/data-zoom/data-zoom/data-zoom';
import { createDiv, removeDom } from '../../../util/dom';

const rows = (xs: number[], offset = 1) => xs.map((x, i) => ({ x, y: i + offset }));
const initial = [0, 20, 40, 60, 80, 100];
const expanded = [...initial, 160, 200];

describe('DataZoom window anchors', () => {
  let chart: VChart;
  let dom: HTMLElement;
  const zoom = () =>
    chart
      .getChart()
      .getAllComponents()
      .find(c => c.type === 'dataZoom') as DataZoom;
  const visible = () =>
    chart
      .getChart()
      .getAllSeries()[0]
      .getViewData()
      .latestData.map((d: { x: number }) => d.x);
  const create = (window: Record<string, unknown>, values = initial) => {
    chart = new VChart(
      {
        type: 'scatter',
        animation: false,
        data: { id: 'data', values: rows(values) },
        xField: 'x',
        yField: 'y',
        axes: [{ id: 'x', orient: 'bottom', type: 'linear', nice: false, zero: false }, { orient: 'left' }],
        dataZoom: [{ axisId: 'x', orient: 'bottom', ...window }]
      } as any,
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

  it.each([
    ['explicit value', { startValue: 20, endValue: 40, rangeMode: ['value', 'value'] }, [20, 40]],
    ['inferred value', { startValue: 20, endValue: 40 }, [20, 40]],
    ['percent/value', { start: 0.2, endValue: 80, rangeMode: ['percent', 'value'] }, [40, 60, 80]],
    ['value/percent', { startValue: 20, end: 0.4, rangeMode: ['value', 'percent'] }, [20, 40, 60, 80]]
  ])('preserves %s anchors across domain expansion', (_label, window, expected) => {
    create(window as Record<string, unknown>);
    chart.updateDataSync('data', rows(expanded, 5));
    expect(visible()).toEqual(expected);
    expect(zoom().stateScale.domain()).toEqual([0, 200]);
  });

  it.each([[[]], [initial]])('retains value anchors through empty data and refill from %j', values => {
    create({ startValue: 20, endValue: 40, rangeMode: ['value', 'value'] }, values as number[]);
    chart.updateDataSync('data', []);
    chart.updateDataSync('data', rows(expanded));
    expect(visible()).toEqual([20, 40]);
    expect(zoom().getVRenderComponents()[0].attribute).toMatchObject({ start: 0.1, end: 0.2 });
  });

  it('records value anchors supplied by the public API', () => {
    create({ start: 0, end: 0.5 });
    zoom().setStartAndEnd(40, 80, ['value', 'value']);
    chart.updateDataSync('data', rows(expanded));
    expect(visible()).toEqual([40, 60, 80]);
  });

  it.each([false, true])('keeps layout band-size constraints separate from window anchors (vertical=%s)', vertical => {
    chart = new VChart(
      {
        type: 'area',
        width: vertical ? 800 : 400,
        height: 500,
        direction: vertical ? 'horizontal' : 'vertical',
        animation: false,
        data: { values: Array.from({ length: 9 }, (_, i) => ({ category: `C${i}`, value: i + 1 })) },
        xField: vertical ? 'value' : 'category',
        yField: vertical ? 'category' : 'value',
        axes: [
          {
            orient: vertical ? 'left' : 'bottom',
            type: 'band',
            minBandSize: 50,
            maxBandSize: 100,
            autoRegionSize: true,
            inverse: vertical
          },
          { orient: vertical ? 'bottom' : 'left', type: 'linear' }
        ],
        dataZoom: [
          {
            orient: vertical ? 'right' : 'bottom',
            axisIndex: 0,
            filterMode: 'axis',
            auto: true,
            ignoreBandSize: !vertical,
            start: 0,
            end: vertical ? 0.5 : 1
          }
        ]
      } as any,
      { dom, animation: false }
    );
    chart.renderSync();
    expect(zoom().getVRenderComponents()[0].attribute).toMatchObject({ start: 0, end: vertical ? 0.5 : 1 });
  });

  it('lets the public API switch value anchors to percentages', () => {
    create({ startValue: 20, endValue: 40, rangeMode: ['value', 'value'] });
    zoom().setStartAndEnd(0.5, 1);
    chart.updateDataSync('data', rows(expanded));
    expect(visible()).toEqual([100, 160, 200]);
  });

  it('updates value anchors on a component interaction', () => {
    create({ startValue: 20, endValue: 40, rangeMode: ['value', 'value'] });
    zoom().getVRenderComponents()[0].setStartAndEnd(0.4, 0.8);
    chart.updateDataSync('data', rows(expanded));
    expect(visible()).toEqual([40, 60, 80]);
  });

  it('does not replace anchors when a window change is rejected', () => {
    create({ startValue: 20, endValue: 40, rangeMode: ['value', 'value'], zoomLock: true });
    zoom().setStartAndEnd(0.5, 1);
    chart.updateDataSync('data', rows(expanded));
    expect(visible()).toEqual([20, 40]);
  });
  it.each(['full', 'batch', 'data view'] as const)('retains value anchors through a %s update', async mode => {
    create({ startValue: 20, endValue: 40, rangeMode: ['value', 'value'] });
    const next = rows(expanded, 5);
    if (mode === 'full') {
      chart.updateFullDataSync({ id: 'data', values: next });
    } else if (mode === 'batch') {
      await chart.updateDataInBatches([{ id: 'data', data: next }]);
    } else {
      chart.getChart().getAllSeries()[0].getRawData().parseNewData(next);
    }
    expect(visible()).toEqual([20, 40]);
  });

  it('does not overwrite clipped value anchors when the domain shrinks', () => {
    create({ startValue: 20, endValue: 80, rangeMode: ['value', 'value'] });
    chart.updateDataSync('data', rows([40, 60]));
    expect(visible()).toEqual([40, 60]);
    chart.updateDataSync('data', rows(expanded));
    expect(visible()).toEqual([20, 40, 60, 80]);
  });

  it('honors a zero value endpoint without an explicit rangeMode', () => {
    create({ startValue: 0, endValue: 40 });
    chart.updateDataSync('data', rows(expanded));
    expect(visible()).toEqual([0, 20, 40]);
  });

  it('keeps a value anchor when its category is temporarily absent', () => {
    chart = new VChart(
      {
        type: 'bar',
        animation: false,
        xField: 'x',
        yField: 'y',
        data: { id: 'data', values: ['A', 'B', 'C', 'D'].map((x, y) => ({ x, y: y + 1 })) },
        dataZoom: [{ orient: 'bottom', startValue: 'B', endValue: 'C', rangeMode: ['value', 'value'] }]
      },
      { dom, animation: false }
    );
    chart.renderSync();
    chart.updateDataSync('data', [
      { x: 'A', y: 2 },
      { x: 'D', y: 4 }
    ]);
    expect(visible()).toEqual([]);
    chart.updateDataSync(
      'data',
      ['A', 'B', 'C', 'D', 'E'].map((x, y) => ({ x, y: y + 1 }))
    );
    expect(visible()).toEqual(['B', 'C']);
  });

  it.each(['bottom', 'left'] as const)('resolves value anchors on an inverse %s axis', orient => {
    const horizontal = orient === 'bottom';
    chart = new VChart(
      {
        type: 'scatter',
        animation: false,
        data: { id: 'data', values: rows(initial) },
        xField: horizontal ? 'x' : 'y',
        yField: horizontal ? 'y' : 'x',
        axes: [{ id: 'value', orient, type: 'linear', inverse: true, nice: false, zero: false }],
        dataZoom: [
          {
            axisId: 'value',
            orient,
            startValue: horizontal ? 80 : 40,
            endValue: horizontal ? 40 : 80,
            rangeMode: ['value', 'value']
          }
        ]
      } as any,
      { dom, animation: false }
    );
    chart.renderSync();
    chart.updateDataSync('data', rows(expanded));
    expect(visible()).toEqual([40, 60, 80]);
  });
  it.each(['dataZoom', 'scrollBar'] as const)('updates the axis viewport for a %s value window', key => {
    chart = new VChart(
      {
        type: 'scatter',
        animation: false,
        data: { id: 'data', values: rows(initial) },
        xField: 'x',
        yField: 'y',
        axes: [{ id: 'x', orient: 'bottom', type: 'linear', nice: false, zero: false }],
        [key]: [
          {
            axisId: 'x',
            orient: 'bottom',
            filterMode: 'axis',
            startValue: 20,
            endValue: 40,
            rangeMode: ['value', 'value']
          }
        ]
      } as any,
      { dom, animation: false }
    );
    chart.renderSync();
    chart.updateDataSync('data', rows(expanded));
    const axis = chart
      .getChart()
      .getAllComponents()
      .find(c => c.getSpec().id === 'x') as any;
    expect(axis.getScale().rangeFactor()[0]).toBeCloseTo(0.1);
    expect(axis.getScale().rangeFactor()[1]).toBeCloseTo(0.2);
  });
  it('commits an API mode change before synchronous event listeners update data', () => {
    create({ startValue: 20, endValue: 40, rangeMode: ['value', 'value'] });
    const onZoom = jest.fn(() => {
      chart.updateDataSync('data', rows(expanded));
    });
    chart.on('dataZoomChange', onZoom);
    zoom().setStartAndEnd(0.5, 1);
    expect(onZoom).toHaveBeenCalledTimes(1);
    expect(visible()).toEqual([100, 160, 200]);
  });
});
