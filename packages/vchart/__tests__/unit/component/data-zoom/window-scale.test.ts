import VChart, { type IScatterChartSpec } from '../../../../src';
import { LinearScale, LogScale, SymlogScale, TimeScale, type IContinuousScale } from '@visactor/vscale';
import { windowFromSpec, windowToRange, updateWindowFromRange } from '../../../../src/component/data-zoom/window';
import { statePointToData } from '../../../../src/component/data-zoom/util';
import type { DataZoom } from '../../../../src/component/data-zoom/data-zoom/data-zoom';
import type { ScrollBar } from '../../../../src/component/data-zoom/scroll-bar/scroll-bar';
import type { CartesianAxis } from '../../../../src/component/axis/cartesian';
import type { IDataFilterComponentSpec } from '../../../../src/component/data-zoom/interface';
import type { DataZoomAttributes, ScrollBarAttributes } from '@visactor/vrender-components';
import { createDiv, removeDom } from '../../../util/dom';

const scaleCases = [
  { name: 'linear', scale: () => new LinearScale(), domain: [0, 100], values: [25, 75], range: [0.25, 0.75] },
  { name: 'log', scale: () => new LogScale(), domain: [1, 1000], values: [10, 100], range: [1 / 3, 2 / 3] },
  { name: 'symlog', scale: () => new SymlogScale(), domain: [-99, 99], values: [-9, 9], range: [0.25, 0.75] },
  { name: 'time', scale: () => new TimeScale(), domain: [0, 1000000], values: [250000, 750000], range: [0.25, 0.75] }
];

describe.each(scaleCases)('$name window mapping', ({ scale: createScale, domain, values, range: expected }) => {
  it.each([
    [false, false],
    [false, true],
    [true, false],
    [true, true]
  ])('uses scale mapping with reversed range=%s and reversed window=%s', (reverseRange, reverse) => {
    const scale = createScale();
    scale.domain(domain);
    scale.range(reverseRange ? [450, 50] : [50, 450]);
    const window = windowFromSpec({ startValue: values[0], endValue: values[1], rangeMode: ['value', 'value'] });
    const positions = windowToRange(window, scale, reverse);
    positions.forEach((position, index) => {
      expect(position).toBeCloseTo(reverse ? 1 - expected[index] : expected[index]);
      expect(statePointToData(position, scale, reverse)).toBeCloseTo(values[index]);
    });
    updateWindowFromRange(window, positions[0], positions[1], scale, reverse);
    expect([window.start.value, window.end.value]).toEqual(values);
  });
});

it('uses the scale inverse for a piecewise linear domain', () => {
  const scale = new LinearScale().domain([0, 10, 100]).range([20, 120, 220]);
  expect(statePointToData(0.5, scale, false)).toBe(10);
  expect(statePointToData(0.5, scale, true)).toBe(10);
  expect(windowToRange(windowFromSpec({ startValue: 10, endValue: 100 }), scale, false)).toEqual([0.5, 1]);
});

const rows = (expanded = false) =>
  (expanded ? [1, 10, 20, 40, 100, 1000, 10000] : [1, 10, 20, 40, 100, 1000]).map((x, y) => ({ x, y: y + 1 }));
type ComponentKey = 'dataZoom' | 'scrollBar';

describe('Nonlinear axis windows', () => {
  let chart: VChart;
  let dom: HTMLElement;
  const component = (key: ComponentKey) =>
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
  const expectRange = (key: ComponentKey, start: number, end: number) => {
    const attribute = component(key).getVRenderComponents()[0].attribute as Partial<
      DataZoomAttributes & ScrollBarAttributes
    >;
    const range = key === 'dataZoom' ? [attribute.start, attribute.end] : attribute.range;
    expect(range[0]).toBeCloseTo(start);
    expect(range[1]).toBeCloseTo(end);
  };
  const create = (
    key: ComponentKey,
    filterMode: 'filter' | 'axis',
    window: IDataFilterComponentSpec = { startValue: 10, endValue: 100, rangeMode: ['value', 'value'] }
  ) => {
    chart = new VChart(
      {
        type: 'scatter',
        animation: false,
        data: { id: 'data', values: rows() },
        xField: 'x',
        yField: 'y',
        axes: [{ id: 'x', orient: 'bottom', type: 'log', nice: false, zero: false }, { orient: 'left' }],
        [key]: [{ axisId: 'x', orient: 'bottom', filterMode, ...window }]
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

  it.each([
    ['dataZoom', 'filter'],
    ['dataZoom', 'axis'],
    ['scrollBar', 'filter'],
    ['scrollBar', 'axis']
  ] as const)('preserves %s/%s value windows through domain updates', (key, mode) => {
    create(key, mode);
    expectRange(key, 1 / 3, 2 / 3);
    if (mode === 'filter') {
      expect(visible()).toEqual([10, 20, 40, 100]);
    } else {
      expect((axis().getScale() as IContinuousScale).rangeFactor()[0]).toBeCloseTo(1 / 3);
      expect((axis().getScale() as IContinuousScale).rangeFactor()[1]).toBeCloseTo(2 / 3);
    }
    chart.updateDataSync('data', rows(true));
    expectRange(key, 0.25, 0.5);
    if (mode === 'filter') {
      expect(visible()).toEqual([10, 20, 40, 100]);
    } else {
      expect((axis().getScale() as IContinuousScale).rangeFactor()[0]).toBeCloseTo(0.25);
      expect((axis().getScale() as IContinuousScale).rangeFactor()[1]).toBeCloseTo(0.5);
    }
  });

  it.each(['dataZoom', 'scrollBar'] as const)('preserves exact value endpoints supplied to the %s API', key => {
    create(key, 'filter');
    component(key).setStartAndEnd(20, 100, ['value', 'value']);
    expect(visible()).toEqual([20, 40, 100]);
    chart.updateDataSync('data', rows(true));
    expect(visible()).toEqual([20, 40, 100]);
  });

  it.each(['dataZoom', 'scrollBar'] as const)('uses nonlinear inverse mapping after a %s interaction', key => {
    create(key, 'filter');
    if (key === 'dataZoom') {
      (component(key) as DataZoom).getVRenderComponents()[0].setStartAndEnd(0.4, 0.6);
    } else {
      (component(key) as ScrollBar).getVRenderComponents()[0].setScrollRange([0.4, 0.6]);
    }
    expect(visible()).toEqual([20, 40]);
    chart.updateDataSync('data', rows(true));
    expect(visible()).toEqual([20, 40]);
    expectRange(key, 0.3, 0.45);
  });

  it.each<IDataFilterComponentSpec>([
    { start: 0.3, end: 0.7, rangeMode: ['percent', 'percent'] },
    { start: 0.3, endValue: 100, rangeMode: ['percent', 'value'] }
  ])('initializes nonlinear percent/mixed filters from the resolved window', window => {
    create('dataZoom', 'filter', window);
    expect(visible()).toEqual([10, 20, 40, 100]);
  });

  it.each([
    ['bottom', false],
    ['bottom', true],
    ['left', false],
    ['left', true]
  ] as const)('maps value endpoints on a %s axis with inverse=%s', (orient, inverse) => {
    const horizontal = orient === 'bottom';
    const reverse = horizontal ? inverse : !inverse;
    chart = new VChart(
      {
        type: 'scatter',
        animation: false,
        data: { id: 'data', values: rows() },
        xField: horizontal ? 'x' : 'y',
        yField: horizontal ? 'y' : 'x',
        axes: [{ id: 'x', orient, inverse, type: 'log', nice: false, zero: false }],
        dataZoom: [
          {
            axisId: 'x',
            orient,
            startValue: reverse ? 100 : 10,
            endValue: reverse ? 10 : 100,
            rangeMode: ['value', 'value']
          }
        ]
      } as IScatterChartSpec,
      { dom, animation: false }
    );
    chart.renderSync();
    expectRange('dataZoom', 1 / 3, 2 / 3);
    chart.updateDataSync('data', rows(true));
    expectRange('dataZoom', reverse ? 0.5 : 0.25, reverse ? 0.75 : 0.5);
    expect(visible()).toEqual([10, 20, 40, 100]);
  });
});
