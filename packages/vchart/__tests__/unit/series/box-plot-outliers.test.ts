import { DataSet } from '@visactor/vdataset';
import { EventDispatcher } from '../../../src/event/event-dispatcher';
import { GlobalScale } from '../../../src/scale/global-scale';
import VChart from '../../../src';
import { BoxPlotChart, registerBoxplotChart } from '../../../src/chart/box-plot';
import { BoxPlotSeries } from '../../../src/series/box-plot/box-plot';
import { BOX_PLOT_OUTLIER_VALUE_FIELD } from '../../../src/constant/box-plot';
import { SeriesMarkNameEnum } from '../../../src/series/interface/type';
import { getTestCompiler } from '../../util/factory/compiler';
import { getTheme, initChartDataSet, seriesOption } from '../../util/context';
import { createDiv, removeDom } from '../../util/dom';

registerBoxplotChart();

const dataSet = new DataSet();
initChartDataSet(dataSet);

const filledValues = [
  {
    x: 'Sub-Saharan Africa',
    y1: 8.72,
    y2: 9.73,
    y3: 10.17,
    y4: 10.51,
    y5: 11.64,
    y6: [12.01, 12.02, 14.03]
  },
  {
    x: 'South Asia',
    y1: 9.4,
    y2: 10.06,
    y3: 10.75,
    y4: 11.56,
    y5: 12.5
  }
];

const createBoxPlotSeries = () => {
  const series = new BoxPlotSeries<any>(
    {
      type: 'boxPlot',
      xField: 'x',
      minField: 'y1',
      q1Field: 'y2',
      medianField: 'y3',
      q3Field: 'y4',
      maxField: 'y5',
      outliersField: 'y6'
    },
    seriesOption({ dataSet })
  );
  (series as any)._outliersField = 'y6';
  (series as any)._fieldX = ['x'];
  (series as any)._fieldY = ['y5', 'y3', 'y2', 'y4', 'y1'];
  (series as any)._xAxisHelper = {
    getScale: () => ({ type: 'band' })
  };
  (series as any)._yAxisHelper = {
    getScale: () => ({ type: 'linear' })
  };
  return series;
};

const createBoxPlotChart = (values?: Record<string, unknown>[]) => {
  const spec = {
    type: 'boxPlot',
    data: [
      {
        id: 'boxPlot',
        values: values ?? []
      }
    ],
    xField: 'x',
    minField: 'y1',
    q1Field: 'y2',
    medianField: 'y3',
    q3Field: 'y4',
    maxField: 'y5',
    outliersField: 'y6',
    direction: 'vertical',
    animation: false
  } as any;
  const transformer = new BoxPlotChart.transformerConstructor({
    type: 'boxPlot',
    seriesType: 'boxPlot',
    getTheme,
    mode: 'desktop-browser'
  });
  const info = transformer.initChartSpec(spec);
  const chartDataSet = new DataSet();
  initChartDataSet(chartDataSet);
  const chart = new BoxPlotChart(spec, {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    eventDispatcher: new EventDispatcher({} as any, { addEventListener: () => {} } as any),
    globalInstance: {
      isAnimationEnable: () => false,
      getContainer: () => ({}),
      getTooltipHandlerByUser: (() => undefined) as () => undefined
    },
    render: {} as any,
    dataSet: chartDataSet,
    map: new Map(),
    container: null,
    mode: 'desktop-browser',
    getCompiler: getTestCompiler,
    globalScale: new GlobalScale([], { getAllSeries: () => [] as any[] } as any),
    getTheme,
    onError: () => {},
    getSpecInfo: () => info
  } as any);
  chart.created(transformer);
  chart.init();
  return chart;
};

const getOutlierStatistic = (series: { getStatisticFields: () => { key: string; operations: string[] }[] }) =>
  series.getStatisticFields().find(field => field.key === 'y6');

const getFoldedOutlierValues = (series: any): number[] => {
  const rows = series._outlierData?.getLatestData?.() ?? series._outlierData?.getDataView?.()?.latestData ?? [];
  return rows
    .map((row: Record<string, unknown>) => row[BOX_PLOT_OUTLIER_VALUE_FIELD])
    .filter((value: unknown): value is number => typeof value === 'number');
};

describe('BoxPlotSeries getStatisticFields outliersField', () => {
  test('adds array-min/array-max when outliersField is omitted from super fields', () => {
    const series = createBoxPlotSeries();

    expect(getOutlierStatistic(series)).toEqual({
      key: 'y6',
      operations: ['array-min', 'array-max']
    });
  });

  test('replaces min/max with array operations when outliersField is already present', () => {
    const series = createBoxPlotSeries();
    (series as any)._fieldY = ['y5', 'y3', 'y2', 'y4', 'y1', 'y6'];

    expect(getOutlierStatistic(series)).toEqual({
      key: 'y6',
      operations: ['array-min', 'array-max']
    });
    expect(series.getStatisticFields().filter(field => field.key === 'y6')).toHaveLength(1);
  });

  test('still registers outliersField when axis helpers are not ready', () => {
    const series = createBoxPlotSeries();
    (series as any)._xAxisHelper = undefined;
    (series as any)._yAxisHelper = undefined;

    expect(getOutlierStatistic(series)).toEqual({
      key: 'y6',
      operations: ['array-min', 'array-max']
    });
  });

  test('does not invent a statistic field when outliersField is unset', () => {
    const series = createBoxPlotSeries();
    (series as any)._outliersField = undefined;

    expect(getOutlierStatistic(series)).toBeUndefined();
  });
});

describe('boxPlot outliersField after empty-init updateData', () => {
  test('folds y6 array rows after updateData from empty values', () => {
    const chart = createBoxPlotChart([]);
    const series = chart.getAllSeries()[0] as any;

    expect(getOutlierStatistic(series)).toEqual({
      key: 'y6',
      operations: ['array-min', 'array-max']
    });
    expect(getFoldedOutlierValues(series)).toEqual([]);

    chart.updateData('boxPlot', filledValues);

    expect(series.getViewData()?.latestData).toHaveLength(2);
    expect(getFoldedOutlierValues(series)).toEqual([12.01, 12.02, 14.03]);
    expect(series.getViewDataStatistics()?.latestData?.y6).toMatchObject({
      min: 12.01,
      max: 14.03
    });
  });

  test('non-empty init with outliersField still folds outlier rows', () => {
    const chart = createBoxPlotChart(filledValues);
    const series = chart.getAllSeries()[0] as any;

    expect(getOutlierStatistic(series)).toEqual({
      key: 'y6',
      operations: ['array-min', 'array-max']
    });
    expect(getFoldedOutlierValues(series)).toEqual([12.01, 12.02, 14.03]);
    expect(series.getViewDataStatistics()?.latestData?.y6).toMatchObject({
      min: 12.01,
      max: 14.03
    });
  });
});

const describeRender = typeof document === 'undefined' ? describe.skip : describe;

const createIssueSpec = (values?: Record<string, unknown>[]) =>
  ({
    type: 'boxPlot',
    width: 500,
    height: 400,
    data: values
      ? [{ id: 'boxPlot', values }]
      : [
          {
            id: 'boxPlot'
          }
        ],
    xField: 'x',
    minField: 'y1',
    q1Field: 'y2',
    medianField: 'y3',
    q3Field: 'y4',
    maxField: 'y5',
    outliersField: 'y6',
    direction: 'vertical',
    animation: false
  } as any);

const getOutlierGraphics = (chart: VChart) => {
  const series = chart.getChart()?.getAllSeries()[0] as any;
  const outlierMark = series?.getMarks()?.find((mark: { name?: string }) => mark.name === SeriesMarkNameEnum.outlier);
  return {
    series,
    graphics: outlierMark?.getGraphics?.() ?? []
  };
};

describeRender('VChart boxPlot outliersField updateDataSync', () => {
  let dom: HTMLElement;
  let chart: VChart;

  beforeEach(() => {
    dom = createDiv();
    dom.style.width = '500px';
    dom.style.height = '400px';
  });

  afterEach(() => {
    chart?.release();
    removeDom(dom);
  });

  test('renders outlier points after updateDataSync from empty data', () => {
    chart = new VChart(createIssueSpec(), { dom, animation: false });
    chart.renderSync();
    expect(getFoldedOutlierValues(getOutlierGraphics(chart).series)).toEqual([]);

    chart.updateDataSync('boxPlot', filledValues);

    const { series, graphics } = getOutlierGraphics(chart);
    expect(getFoldedOutlierValues(series)).toEqual([12.01, 12.02, 14.03]);
    expect(graphics.length).toBeGreaterThanOrEqual(3);
  });

  test('non-empty init with outliersField still renders outlier points', () => {
    chart = new VChart(createIssueSpec(filledValues), { dom, animation: false });
    chart.renderSync();

    const { series, graphics } = getOutlierGraphics(chart);
    expect(getFoldedOutlierValues(series)).toEqual([12.01, 12.02, 14.03]);
    expect(graphics.length).toBeGreaterThanOrEqual(3);
  });
});
