import VChart, { type DataZoom, type ICommonChartSpec } from '@visactor/vchart';
import { registerDotSeries, type IDotSeriesSpec } from '../../../../src/series/dot';
import { registerLinkSeries, type ILinkSeriesSpec } from '../../../../src/series/link';
import { createDiv, removeDom } from '../../../util/dom';

registerDotSeries();
registerLinkSeries();

describe('sequence dataZoom integration', () => {
  it.each([
    ['from', 'x'],
    ['source', 'x'],
    ['from', 'y'],
    ['source', 'y']
  ])('filters real links with fromField = %s on the %s axis', (fromField, dimension) => {
    const dom = createDiv();
    const dot: IDotSeriesSpec = {
      type: 'dot',
      name: 'events',
      dataId: 'events',
      xField: 'time',
      yField: 'user',
      titleField: 'user',
      leftAppendPadding: 0,
      title: { visible: false },
      subTitle: { visible: false },
      symbol: { visible: false }
    };
    const spec: Omit<ICommonChartSpec, 'series'> & { series: (IDotSeriesSpec | ILinkSeriesSpec)[] } = {
      type: 'common',
      width: 600,
      height: 400,
      data: [
        {
          id: 'events',
          values: [
            { user: 20, dots: [{ node_name: 'a', time: 10 }] },
            { user: 50, dots: [{ node_name: 'b', time: 30 }] },
            { user: 30, dots: [{ node_name: 'c', time: 50 }] }
          ]
        },
        { id: 'links', values: ['a', 'b', 'c'].map(node => ({ [fromField]: node, target: 'c' })) }
      ],
      series: [
        {
          type: 'link',
          dataId: 'links',
          dotSeriesIndex: 1,
          dotSeriesSpec: dot,
          fromField,
          toField: 'target',
          leftAppendPadding: 0
        },
        dot
      ],
      axes: [
        { type: 'linear', orient: 'bottom', min: 0, max: 60, nice: false },
        { type: 'linear', orient: 'left', min: 0, max: 60, nice: false }
      ],
      dataZoom: [
        {
          orient: dimension === 'x' ? 'bottom' : 'left',
          ...(dimension === 'x' ? { xAxisIndex: 0 } : { yAxisIndex: 1 }),
          filterMode: 'filter',
          start: 0,
          end: 1
        }
      ]
    };
    const chart = new VChart(spec, { dom, animation: false });
    try {
      chart.renderSync();
      const link = chart
        .getChart()
        .getAllSeries()
        .find(series => series.type === 'link');
      const starts = () => link.getViewData().latestData.map((datum: Record<string, unknown>) => datum[fromField]);
      expect(starts()).toEqual(['a', 'b', 'c']);
      const zoom = chart.getChart().getComponentsByKey('dataZoom')[0] as DataZoom;
      // 竖直轴的选区从上到下排列，对应数值从大到小。
      zoom.setStartAndEnd(dimension === 'x' ? 10 : 40, dimension === 'x' ? 40 : 10, ['value', 'value']);
      expect(starts()).toEqual(dimension === 'x' ? ['a', 'b'] : ['a', 'c']);
      zoom.setStartAndEnd(0, 1);
      expect(starts()).toEqual(['a', 'b', 'c']);
    } finally {
      chart.release();
      removeDom(dom);
    }
  });
});
