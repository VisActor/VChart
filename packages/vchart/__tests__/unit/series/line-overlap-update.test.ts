import VChart, { ManualTicker, type ILineChartSpec } from '../../../src';
import type { ISymbolGraphicAttribute } from '@visactor/vrender-core';
import { setGraphicStates } from '../../../src/util/graphic-state';

const makeValues = (count: number) =>
  ['green', 'orange'].flatMap(group => Array.from({ length: count }, (_, i) => ({ x: `item-${i}`, y: i + 1, group })));

const makeSpec = (count: number, horizontal = false): ILineChartSpec => ({
  type: 'line',
  width: horizontal ? 160 : 240,
  height: horizontal ? 240 : 160,
  padding: 0,
  animation: false,
  direction: horizontal ? 'horizontal' : 'vertical',
  data: { id: 'data', values: makeValues(count) },
  xField: horizontal ? 'y' : 'x',
  yField: horizontal ? 'x' : 'y',
  seriesField: 'group',
  markOverlap: true,
  point: { style: { size: 14 } },
  axes: [
    { orient: 'bottom', visible: false },
    { orient: 'left', visible: false }
  ]
});

const points = (chart: VChart) => chart.getChart().getAllSeries()[0].getMarkInName('point').getGraphics();
const visibleCount = (chart: VChart, group: string) =>
  points(chart).filter(g => g.context.data[0].group === group && g.attribute.visible !== false).length;
const snapshot = (chart: VChart) =>
  points(chart).map(g => ({
    x: g.attribute.x,
    y: g.attribute.y,
    visible: g.attribute.visible,
    size: (g.attribute as ISymbolGraphicAttribute).size,
    fill: g.attribute.fill
  }));

describe('line overlap updates', () => {
  const charts: VChart[] = [];
  const containers: HTMLElement[] = [];
  const createChart = (spec: ILineChartSpec, ticker?: ManualTicker) => {
    const dom = document.createElement('div');
    document.body.appendChild(dom);
    containers.push(dom);
    const chart = new VChart(spec, { dom, ticker, animation: spec.animation !== false });
    charts.push(chart);
    chart.renderSync();
    return chart;
  };

  afterEach(() => {
    charts.splice(0).forEach(chart => chart.release());
    containers.splice(0).forEach(dom => dom.remove());
  });

  test.each([false, true])('dense to sparse update restores reused points, horizontal=%s', horizontal => {
    const chart = createChart(makeSpec(12, horizontal));
    const original = points(chart).slice();
    expect(visibleCount(chart, 'green')).toBeLessThan(12);

    chart.updateSpecSync(makeSpec(3, horizontal));

    const green = points(chart).filter(g => g.context.data[0].group === 'green');
    expect(green.every(g => original.includes(g))).toBe(true);
    expect(visibleCount(chart, 'green')).toBe(3);
    expect(visibleCount(chart, 'orange')).toBe(3);
    expect(snapshot(chart)).toEqual(snapshot(createChart(makeSpec(3, horizontal))));

    chart.updateSpecSync(makeSpec(12, horizontal));
    expect(visibleCount(chart, 'green')).toBeLessThan(12);
    chart.updateSpecSync(makeSpec(3, horizontal));
    expect(visibleCount(chart, 'green')).toBe(3);
    expect(visibleCount(chart, 'orange')).toBe(3);
  });

  test('a previous overlap decision does not override the next explicit visibility', () => {
    const chart = createChart(makeSpec(12));
    // 在真实图元上再次运行防重叠，覆盖旧实现的隐藏标记已存在的路径。
    chart.updateSpecSync(makeSpec(12));
    const spec = makeSpec(3);
    spec.point.style.visible = datum => datum.x !== 'item-1';

    chart.updateSpecSync(spec);

    expect(visibleCount(chart, 'green')).toBe(2);
    expect(visibleCount(chart, 'orange')).toBe(2);
    expect(snapshot(chart)).toEqual(snapshot(createChart(spec)));
  });

  test('updateData restores points that no longer overlap', () => {
    const chart = createChart(makeSpec(12));
    const original = points(chart)[1];
    expect(original.attribute.visible).toBe(false);

    chart.updateDataSync('data', makeValues(3));

    expect(points(chart)[1]).toBe(original);
    expect(snapshot(chart)).toEqual(snapshot(createChart(makeSpec(3))));
  });

  test('resize recomputes visibility in both directions', () => {
    const chart = createChart(makeSpec(12));
    const narrow = snapshot(chart);

    chart.resize(720, 160);
    expect(visibleCount(chart, 'green')).toBe(12);
    expect(visibleCount(chart, 'orange')).toBe(12);

    chart.resize(240, 160);
    expect(snapshot(chart)).toEqual(narrow);
  });

  test('hover after an update restores the new normal visibility', () => {
    const chart = createChart(makeSpec(12));
    chart.updateSpecSync(makeSpec(3));
    const point = points(chart)[1];

    setGraphicStates(point, ['dimension_hover'], false);
    setGraphicStates(point, [], false);

    expect(point.attribute.visible).toBe(true);
    expect(snapshot(chart)).toEqual(snapshot(createChart(makeSpec(3))));
  });

  test('animated update finishes with the same visible points as a fresh render', () => {
    const ticker = new ManualTicker();
    ticker.autoStop = false;
    const animatedSpec = (count: number): ILineChartSpec => ({
      ...makeSpec(count),
      animation: true,
      animationAppear: { duration: 300, easing: 'linear' },
      animationUpdate: { duration: 300, easing: 'linear' }
    });
    try {
      const chart = createChart(animatedSpec(12), ticker);
      ticker.tickAt(400);
      chart.updateSpecSync(animatedSpec(3));
      ticker.tickAt(800);

      expect(visibleCount(chart, 'green')).toBe(3);
      expect(visibleCount(chart, 'orange')).toBe(3);
      expect(snapshot(chart)).toEqual(snapshot(createChart(makeSpec(3))));
    } finally {
      charts.splice(0).forEach(chart => chart.release());
      ticker.release();
    }
  });
});
