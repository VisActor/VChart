import type { ILineChartSpec } from '../../../src/chart/line/interface';
import { GlobalScale } from '../../../src/scale/global-scale';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import type { LineSeries } from '../../../src/series/line/line';
import { DataSet, DataView, csvParser, dataViewParser } from '@visactor/vdataset';
import { LineChart } from '../../../src/chart/line/line';
import { EventDispatcher } from '../../../src/event/event-dispatcher';
import { getTestCompiler } from '../../util/factory/compiler';
import { ThemeManager } from '../../../src';

const dataSet = new DataSet();
dataSet.registerParser('csv', csvParser);
dataSet.registerParser('dataview', dataViewParser);
const dataView = new DataView(dataSet);
const data = `x,type,y
1,1,850
2,2,740
3,3,900
4,4,570
5,5,670`;
dataView.parse(data, {
  type: 'csv'
});
const spec = {
  type: 'line',
  data: dataView,
  xField: 'x',
  yField: 'y',
  animation: false
};

describe('line chart test', () => {
  test('line chart init', () => {
    const chart = new LineChart(spec, {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      eventDispatcher: new EventDispatcher({} as any, { addEventListener: () => {} } as any),
      globalInstance: {
        getContainer: () => ({}),
        getTooltipHandlerByUser: (() => undefined) as () => undefined
      },
      render: {} as any,
      dataSet,
      map: new Map(),
      container: null,
      mode: 'desktop-browser',
      getCompiler: getTestCompiler,
      globalScale: new GlobalScale([], { getAllSeries: () => [] as any[] } as any),
      getTheme: () => ThemeManager.getCurrentTheme(),
      onError: () => {}
    } as any);
    chart.created();
    chart.init();

    // spec
    const transformSpec = chart.getSpec();
    expect(transformSpec.hover).toBeUndefined();
    expect(transformSpec.select).toBeUndefined();

    expect(chart.getAllSeries().length).toEqual(1);
    const series: LineSeries = chart.getAllSeries()[0] as LineSeries;
    expect(series.type).toEqual('line');
    expect(series.fieldX).toEqual(['x']);
    expect(series.fieldY).toEqual(['y']);
    expect(series.getSpec().animation).toBeFalsy();

    // trigger config
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const trigger = series._trigger;
    expect(trigger.hover).toEqual({
      enable: true,
      trigger: 'pointermove',
      triggerOff: ['pointermove', 'pointerleave']
    });
    expect(trigger.select).toEqual({
      enable: true,
      trigger: 'pointertap'
    });

    // mark
    expect(series.getMarks().length).toEqual(3);

    // const mark = series.getMarks()[0];
    // scale.range在layout之后设置，所以这里的range为默认的[0,1]
    //TODO: 开发过程中这里会经常发生变动，稳定后再放出来
    // expect(mark.getAttribute('x', { x: '1' }, 'normal')).toEqual(
    //   0.11538461538461547
    // );
    // expect(mark.getAttribute('y', { y: 100 }, 'normal')).toEqual(
    //   0.18803418803418803
    // );

    expect(chart.getRegionsInIndex().length).toEqual(1);
    expect(series.getRegion().id).toEqual(chart.getRegionsInIndex()[0].id);
  });

  test('line chart init in mode which is `mobile-browser`', () => {
    const chart = new LineChart(
      {
        type: 'line',
        data: dataView,
        xField: 'x',
        yField: 'y',
        select: false
      } as ILineChartSpec,
      {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        eventDispatcher: new EventDispatcher({} as any, { addEventListener: () => {} } as any),
        globalInstance: {
          getContainer: () => ({}),
          getTooltipHandlerByUser: (() => undefined) as () => undefined
        },
        render: {} as any,
        dataSet,
        map: new Map(),
        container: null,
        mode: 'mobile-browser',
        getCompiler: getTestCompiler,
        globalScale: new GlobalScale([], { getAllSeries: () => [] as any[] } as any),
        getTheme: () => ThemeManager.getCurrentTheme()
      } as any
    );
    chart.created();
    chart.init();

    // spec
    const transformSpec = chart.getSpec();
    expect(transformSpec.hover).toBeUndefined();
    expect(transformSpec.select).toBe(false);

    expect(chart.getAllSeries().length).toEqual(1);
    const series: LineSeries = chart.getAllSeries()[0] as LineSeries;
    // trigger config
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const trigger = series._trigger;
    expect(trigger.hover).toEqual({
      enable: true,
      trigger: 'pointerover',
      triggerOff: 'pointerout'
    });
    expect(trigger.select).toEqual({
      enable: false,
      trigger: 'tap'
    });
  });
});
