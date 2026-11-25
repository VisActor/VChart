import VChart from '@visactor/vchart';
import type { ComponentMark, ILineChartSpec } from '@visactor/vchart';
import { appendSeriesBreakConfig, registerSeriesBreak } from '../../../src/components/series-break';
import type { SeriesBreakComponent } from '../../../src/components/series-break';

describe('series break span', () => {
  beforeAll(() => registerSeriesBreak());

  it.each(['series', 'region'] as const)('renders the break across the configured %s', span => {
    const spec: ILineChartSpec = {
      type: 'line',
      width: 400,
      height: 300,
      animation: false,
      data: {
        values: [
          { x: 'A', y: 15 },
          { x: 'B', y: 100 }
        ]
      },
      xField: 'x',
      yField: 'y',
      axes: [{ type: 'linear', orient: 'left', max: 120, breaks: [{ range: [20, 80], scopeType: 'length' }] }]
    };
    appendSeriesBreakConfig(spec, span === 'region' ? { span } : undefined);

    const dom = document.body.appendChild(document.createElement('div'));
    const vchart = new VChart(spec, { dom, autoFit: false });
    try {
      vchart.renderSync();
      const chart = vchart.getChart();
      const region = chart.getRegionsInIndex()[0];
      const { x, y } = region.getLayoutStartPoint();
      const { width } = region.getLayoutRect();
      const axis = chart.getComponentByIndex('axes', 0) as unknown as { valueToPosition: (value: number) => number };
      const [mark] = chart.getComponentsByKey('customMark')[0].getMarks() as ComponentMark[];
      const graphic = mark.getComponent() as unknown as SeriesBreakComponent;
      const [symbol] = graphic.getChildren();
      expect(symbol.getChildren()).toHaveLength(3);

      const [data] = graphic.attribute.data;
      expect(data.start.y).toBeCloseTo(y + axis.valueToPosition(20));
      expect(data.end.y).toBeCloseTo(data.start.y);
      expect(data.end.x - data.start.x).toBeCloseTo(span === 'region' ? width : 20);
      if (span === 'region') {
        expect(data.start.x).toBeCloseTo(x);
      }
    } finally {
      vchart.release();
      dom.remove();
    }
  });
});
