import { BarChart, CommonChart, ThemeManager } from '../../../src';
import { DataSet, DataView, csvParser } from '@visactor/vdataset';
import { EventDispatcher } from '../../../src/event/event-dispatcher';
import { createCanvas, removeDom } from '../../util/dom';
import { getTestCompiler } from '../../util/factory/compiler';
import { GlobalScale } from '../../../src/scale/global-scale';
import { initChartDataSet } from '../../util/context';

const dataSet = new DataSet();
initChartDataSet(dataSet);
dataSet.registerParser('csv', csvParser);

const data = [
  {
    name: '广东',
    value: 21197
  },
  {
    name: '江苏',
    value: 20383
  }
];

type DataType = { name: string; value: number; ratio: string; type?: string };

const scatterData = ['A', 'B', 'C'].reduce((acc: any[], cur: string) => {
  const seriesData = data.map(d => {
    return { name: d.name, value: d.value + ~~(Math.random() * 10000 - 5000), type: cur };
  });
  return [...acc, ...seriesData];
}, []) as DataType[];

const barData = scatterData.reduce((acc: any[], cur: DataType) => {
  const oneData = acc.find(d => d.name === cur.name) as DataType;
  if (oneData) {
    oneData.value += cur.value;
  } else {
    acc.push(cur);
  }
  return acc;
}, []);

const scatterSpec = {
  type: 'common',
  series: [
    {
      type: 'scatter',
      data: { values: scatterData },
      xField: 'name',
      yField: 'value',
      seriesField: 'type'
    }
  ],
  axes: [{ orient: 'left' }, { orient: 'bottom', label: { visible: true }, type: 'band' }]
};

const multiScatterSeriesSpec = {
  type: 'common',
  series: [
    {
      type: 'scatter',
      data: scatterData.filter(d => d.type === 'A'),
      xField: 'sex',
      yField: 'height',
      morph: {
        enable: false,
        morphKey: 'A'
      }
    },
    {
      type: 'scatter',
      data: scatterData.filter(d => d.type === 'B'),
      xField: 'sex',
      yField: 'height',
      morph: {
        morphKey: 'B'
      }
    },
    {
      type: 'scatter',
      data: scatterData.filter(d => d.type === 'C'),
      xField: 'sex',
      yField: 'height',
      morph: {
        morphElementKey: 'ratio'
      }
    }
  ]
};

const barSpec = {
  type: 'bar',
  data: new DataView(dataSet).parse(barData),
  xField: 'name',
  yField: 'value'
};

describe('Bar chart test', () => {
  let canvasDom: HTMLCanvasElement;
  beforeEach(() => {
    canvasDom = createCanvas();
    canvasDom.style.position = 'relative';
    canvasDom.style.width = '500px';
    canvasDom.style.height = '500px';
    canvasDom.width = 500;
    canvasDom.height = 500;
  });

  afterEach(() => {
    removeDom(canvasDom);
  });

  test('default morph', () => {
    const transformer = new CommonChart.transformerConstructor({
      type: 'common',
      getTheme: () => ThemeManager.getCurrentTheme(true),
      mode: 'desktop-browser'
    });
    const info = transformer.initChartSpec(scatterSpec as any);
    const scatterChart = new CommonChart(
      scatterSpec as any,
      {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
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
        animation: true,
        onError: () => {},
        getTheme: () => ThemeManager.getCurrentTheme(true),
        getSpecInfo: () => info
      } as any
    );
    scatterChart.created();
    scatterChart.init();

    const barTransformer = new BarChart.transformerConstructor({
      type: 'bar',
      seriesType: 'bar',
      getTheme: () => ThemeManager.getCurrentTheme(true),
      mode: 'desktop-browser'
    });
    const barInfo = barTransformer.initChartSpec(barSpec as any);
    const barChart = new BarChart(
      barSpec as any,
      {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
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
        animation: true,
        onError: () => {},
        getTheme: () => ThemeManager.getCurrentTheme(true),
        getSpecInfo: () => barInfo
      } as any
    );
    barChart.created();
    barChart.init();

    const barSeries = barChart.getAllSeries()[0];
    const scatterSeries = scatterChart.getAllSeries()[0];

    expect(barSeries.getMarksInType('rect')[0].getMorphKey()).toEqual(
      scatterSeries.getMarksInType('symbol')[0].getMorphKey()
    );

    expect(barSeries.getMarksInType('rect')[0].getMorphElementKey()).toBe('name');
    expect(barSeries.getMarksInType('rect')[0].getMorphElementKey()).toEqual(
      scatterSeries.getMarksInType('symbol')[0].getMorphElementKey()
    );
  });

  test('custom morph config', () => {
    const transformer = new CommonChart.transformerConstructor({
      type: 'common',
      getTheme: () => ThemeManager.getCurrentTheme(true),
      mode: 'desktop-browser'
    });
    const info = transformer.initChartSpec(multiScatterSeriesSpec as any);
    const scatterChart = new CommonChart(
      multiScatterSeriesSpec as any,
      {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
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
        animation: true,
        onError: () => {},
        getTheme: () => ThemeManager.getCurrentTheme(true),
        getSpecInfo: () => info
      } as any
    );
    scatterChart.created();
    scatterChart.init();

    const ASeries = scatterChart.getAllSeries()[0];
    const BSeries = scatterChart.getAllSeries()[1];
    const CSeries = scatterChart.getAllSeries()[2];

    // vchart morph config
    expect(ASeries.getMarksInType('symbol')[0].getMorph()).toBe(false);
    expect(BSeries.getMarksInType('symbol')[0].getMorph()).toBe(true);
    expect(CSeries.getMarksInType('symbol')[0].getMorph()).toBe(true);
    expect(ASeries.getMarksInType('symbol')[0].getMorphKey()).toBe('A');
    expect(BSeries.getMarksInType('symbol')[0].getMorphKey()).toBe('B');
    expect(CSeries.getMarksInType('symbol')[0].getMorphKey()).toBe('2');
    expect(ASeries.getMarksInType('symbol')[0].getMorphElementKey()).toBe('sex');
    expect(BSeries.getMarksInType('symbol')[0].getMorphElementKey()).toBe('sex');
    expect(CSeries.getMarksInType('symbol')[0].getMorphElementKey()).toBe('ratio');
  });
});
