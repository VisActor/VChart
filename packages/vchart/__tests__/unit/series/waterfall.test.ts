import type { ILineGraphicAttribute, IRectGraphicAttribute } from '@visactor/vrender-core';
import VChart from '../../../src';
import type { IWaterfallChartSpec } from '../../../src/chart/waterfall/interface';
import type { WaterfallSeries } from '../../../src/series/waterfall/waterfall';
import { createDiv, removeDom } from '../../util/dom';

type Direction = 'horizontal' | 'vertical';
type CalculationMode = 'increase' | 'decrease';

const createSpec = (direction: Direction, calculationMode: CalculationMode, inverse?: boolean): IWaterfallChartSpec => {
  const horizontal = direction === 'horizontal';
  return {
    type: 'waterfall',
    direction,
    calculationMode,
    width: 500,
    height: 500,
    animation: false,
    data: {
      values: [
        { category: 'Feb.4', total: true, value: 45 },
        { category: 'Feb.11', value: -5 },
        { category: 'Feb.20', value: 2 },
        { category: 'Feb.25', value: -2 },
        { category: 'total', total: true, value: 40 }
      ]
    },
    xField: horizontal ? 'value' : 'category',
    yField: horizontal ? 'category' : 'value',
    total: { type: 'field', tagField: 'total', valueField: 'value' },
    axes: horizontal
      ? [
          { orient: 'bottom', type: 'linear' },
          { orient: 'left', type: 'band', paddingInner: 0.4, inverse }
        ]
      : [
          { orient: 'left', type: 'linear' },
          { orient: 'bottom', type: 'band', paddingInner: 0.4, inverse }
        ]
  };
};

describe('Waterfall leader line geometry', () => {
  let chart: VChart;
  let dom: HTMLElement;

  beforeEach(() => {
    dom = createDiv();
  });

  afterEach(() => {
    chart?.release();
    removeDom(dom);
  });

  const expectLinesBetweenBars = (direction: Direction) => {
    const series = chart.getChart().getAllSeries()[0] as WaterfallSeries;
    const bars = new Map<string, IRectGraphicAttribute>();
    series
      .getMarkInName('bar')
      .getGraphics()
      .forEach(graphic => {
        bars.set(graphic.context.data[0].category, graphic.attribute as IRectGraphicAttribute);
      });
    const lines = series
      .getMarkInName('leaderLine')
      .getGraphics()
      .filter(graphic => graphic.attribute.visible !== false);
    expect(lines).toHaveLength(bars.size - 1);

    const position = direction === 'horizontal' ? 'y' : 'x';
    const size = direction === 'horizontal' ? 'height' : 'width';
    lines.forEach(graphic => {
      const { lastIndex, index } = graphic.context.data[0];
      const previous = bars.get(lastIndex);
      const next = bars.get(index);
      const points = (graphic.attribute as ILineGraphicAttribute).points;
      // Derive facing edges from rendered bars, independently of axis inverse and calculation mode.
      const forward = previous[position] < next[position];
      const start = previous[position] + (forward ? previous[size] : 0);
      const end = next[position] + (forward ? 0 : next[size]);

      expect(points).toHaveLength(2);
      expect(points[0][position]).toBeCloseTo(start);
      expect(points[1][position]).toBeCloseTo(end);
      expect(Math.abs(points[1][position] - points[0][position])).toBeCloseTo(Math.abs(end - start));
    });
  };

  describe.each<Direction>(['horizontal', 'vertical'])('%s', direction => {
    describe.each<CalculationMode>(['increase', 'decrease'])('%s', calculationMode => {
      test.each([undefined, false, true])('connects facing bar edges with inverse=%s', inverse => {
        chart = new VChart(createSpec(direction, calculationMode, inverse), { dom, animation: false });
        chart.renderSync();

        expectLinesBetweenBars(direction);
      });
    });
  });

  test('updates facing edges when the horizontal category axis is reversed', () => {
    chart = new VChart(createSpec('horizontal', 'increase'), { dom, animation: false });
    chart.renderSync();
    expectLinesBetweenBars('horizontal');

    for (const inverse of [true, false]) {
      chart.updateSpecSync(createSpec('horizontal', 'increase', inverse));
      expectLinesBetweenBars('horizontal');
    }
  });
});
