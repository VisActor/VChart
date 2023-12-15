import { DataSet, csvParser } from '@visactor/vdataset';
import { EventDispatcher } from '../../../src/event/event-dispatcher';
import type { LinearProgressSeries } from '../../../src';
// eslint-disable-next-line no-duplicate-imports
import { LinearProgressChart, ThemeManager } from '../../../src';
import { getTestCompiler } from '../../util/factory/compiler';
import { GlobalScale } from '../../../src/scale/global-scale';
import { initChartDataSet } from '../../util/context';

// 保证引入执行 Build-in
const dataSet = new DataSet();
initChartDataSet(dataSet);
dataSet.registerParser('csv', csvParser);
const spec = {
  type: 'linearProgress',
  data: [
    {
      id: 'id0',
      values: [
        {
          type: 'A',
          value: 0.6
        }
      ]
    }
  ],
  // direction: 'horizontal',
  xField: 'value',
  yField: 'type',

  cornerRadius: 20,
  bandWidth: 30,
  axes: [
    { orient: 'left', label: { visible: true }, type: 'band' },
    { orient: 'bottom', label: { visible: true }, type: 'linear' }
  ]
};

describe('linearProgress chart test', () => {
  test('linearProgress init', () => {
    const transformer = new LinearProgressChart.transformerConstructor({
      type: 'linearProgress',
      seriesType: 'linearProgress',
      getTheme: () => ThemeManager.getCurrentTheme()
    });
    const info = transformer.initChartSpec(spec as any);
    const chart = new LinearProgressChart(
      spec as any,
      {
        eventDispatcher: new EventDispatcher({} as any, { addEventListener: () => {} } as any),
        globalInstance: {
          getContainer: () => ({}),
          getTooltipHandlerByUser: (() => undefined) as () => undefined
        },
        dataSet,
        map: new Map(),
        container: null,
        mode: 'desktop-browser',
        getCompiler: getTestCompiler,
        globalScale: new GlobalScale([], { getAllSeries: () => [] as any[] } as any),
        getTheme: () => ThemeManager.getCurrentTheme(),
        animation: false,
        getSpecInfo: () => info
      } as any
    );
    chart.created();
    chart.init();

    // spec
    const transformSpec = chart.getSpec();
    expect(transformSpec.hover).toBeUndefined();
    expect(transformSpec.select).toBeUndefined();

    expect(chart.getAllSeries().length).toEqual(1);
    const series: LinearProgressSeries = chart.getAllSeries()[0] as LinearProgressSeries;
    expect(series.type).toEqual('linearProgress');
    expect(series.getSpec().animation).toBeFalsy();

    // trigger config
    const trigger = series.getTrigger();
    expect(trigger.hover).toEqual({
      enable: true,
      trigger: 'pointermove',
      triggerOff: 'pointerleave'
    });
    expect(trigger.select).toEqual({
      enable: true,
      trigger: 'pointertap'
    });

    // mark
    expect(series.getMarks().length).toEqual(4);
    expect(chart.getRegionsInIndex().length).toEqual(1);
    expect(series.getRegion().id).toEqual(chart.getRegionsInIndex()[0].id);
  });
});
