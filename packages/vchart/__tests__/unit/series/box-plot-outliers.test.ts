import VChart from '../../../src';
import { BOX_PLOT_OUTLIER_VALUE_FIELD } from '../../../src/constant/box-plot';
import { SeriesMarkNameEnum } from '../../../src/series/interface/type';
import { createDiv, removeDom } from '../../util/dom';

const issueValues = [
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

const extremeValues = [
  {
    x: 'Sub-Saharan Africa',
    y1: 8.72,
    y2: 9.73,
    y3: 10.17,
    y4: 10.51,
    y5: 11.64,
    y6: [12.01, 100]
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

const valueFields = {
  minField: 'y1',
  q1Field: 'y2',
  medianField: 'y3',
  q3Field: 'y4',
  maxField: 'y5',
  outliersField: 'y6'
};

const loadCanvas = () => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    return require('canvas') as { createCanvas?: (width: number, height: number) => unknown };
  } catch {
    return null;
  }
};

const canvasPkg = loadCanvas();
const canRender = typeof document !== 'undefined' || typeof canvasPkg?.createCanvas === 'function';
const describeRender = canRender ? describe : describe.skip;

const createIssueSpec = (options?: {
  values?: Record<string, unknown>[];
  direction?: 'vertical' | 'horizontal';
  outliersField?: string;
}) => {
  const direction = options?.direction ?? 'vertical';
  const data = options?.values ? [{ id: 'boxPlot', values: options.values }] : [{ id: 'boxPlot' }];
  return {
    type: 'boxPlot',
    width: 500,
    height: 400,
    data,
    ...(direction === 'horizontal' ? { yField: 'x' } : { xField: 'x' }),
    ...valueFields,
    ...(options && 'outliersField' in options ? { outliersField: options.outliersField } : {}),
    direction,
    animation: false
  } as any;
};

const getSeries = (chart: VChart) => chart.getChart()?.getAllSeries()[0] as any;

const getFoldedOutlierValues = (series: any): number[] => {
  const rows = series?._outlierData?.getLatestData?.() ?? [];
  return rows
    .map((row: Record<string, unknown>) => row[BOX_PLOT_OUTLIER_VALUE_FIELD])
    .filter((value: unknown): value is number => typeof value === 'number');
};

const getOutlierGraphics = (chart: VChart) => {
  const series = getSeries(chart);
  const outlierMark = series?.getMarks?.().find((mark: { name?: string }) => mark.name === SeriesMarkNameEnum.outlier);
  return outlierMark?.getGraphics?.() ?? [];
};

const getLinearDomain = (chart: VChart): number[] => {
  const linear = (chart.getChart()?.getAllComponents() ?? []).find(
    (component: any) => component.getScale?.()?.type === 'linear'
  ) as { getScale?: () => { domain?: () => number[] } } | undefined;
  return linear?.getScale?.().domain?.() ?? [];
};

const getOutlierStatistic = (chart: VChart) =>
  getSeries(chart)
    ?.getStatisticFields?.()
    .find((field: { key: string }) => field.key === 'y6');

describeRender('VChart boxPlot outliersField public API', () => {
  const charts: VChart[] = [];
  const doms: HTMLElement[] = [];

  const render = (spec: Record<string, unknown>) => {
    let chart: VChart;
    if (typeof document !== 'undefined') {
      const dom = createDiv();
      dom.style.width = '500px';
      dom.style.height = '400px';
      doms.push(dom);
      chart = new VChart(spec as any, { dom, animation: false });
    } else {
      chart = new VChart(spec as any, { mode: 'node', modeParams: canvasPkg, animation: false } as any);
    }
    charts.push(chart);
    chart.renderSync();
    return chart;
  };

  afterEach(() => {
    charts.splice(0).forEach(chart => chart.release());
    doms.splice(0).forEach(removeDom);
  });

  test('renders outlier points after updateDataSync from empty data', () => {
    const chart = render(createIssueSpec());
    expect(getFoldedOutlierValues(getSeries(chart))).toEqual([]);

    chart.updateDataSync('boxPlot', issueValues);

    const series = getSeries(chart);
    expect(getOutlierStatistic(chart)).toEqual({
      key: 'y6',
      operations: ['array-min', 'array-max']
    });
    expect(getFoldedOutlierValues(series)).toEqual([12.01, 12.02, 14.03]);
    expect(series.getViewDataStatistics()?.latestData?.y6).toMatchObject({
      min: 12.01,
      max: 14.03
    });
    expect(getLinearDomain(chart)[1]).toBeGreaterThanOrEqual(14.03);
    expect(getOutlierGraphics(chart).length).toBeGreaterThanOrEqual(3);
  });

  test('non-empty init with outliersField still renders outlier points', () => {
    const chart = render(createIssueSpec({ values: issueValues }));

    expect(getFoldedOutlierValues(getSeries(chart))).toEqual([12.01, 12.02, 14.03]);
    expect(getLinearDomain(chart)[1]).toBeGreaterThanOrEqual(14.03);
    expect(getOutlierGraphics(chart).length).toBeGreaterThanOrEqual(3);
  });

  test('includes outliers beyond the box range in the value axis domain', () => {
    const chart = render(createIssueSpec());
    chart.updateDataSync('boxPlot', extremeValues);

    expect(getFoldedOutlierValues(getSeries(chart))).toEqual([12.01, 100]);
    expect(getSeries(chart).getViewDataStatistics()?.latestData?.y6).toMatchObject({
      min: 12.01,
      max: 100
    });
    expect(getLinearDomain(chart)[1]).toBeGreaterThanOrEqual(100);
    expect(getOutlierGraphics(chart).length).toBeGreaterThanOrEqual(2);
  });

  test('horizontal layout still folds outliers after updateDataSync from empty data', () => {
    const chart = render(createIssueSpec({ direction: 'horizontal' }));
    chart.updateDataSync('boxPlot', extremeValues);

    expect(getOutlierStatistic(chart)).toEqual({
      key: 'y6',
      operations: ['array-min', 'array-max']
    });
    expect(getFoldedOutlierValues(getSeries(chart))).toEqual([12.01, 100]);
    expect(getLinearDomain(chart)[1]).toBeGreaterThanOrEqual(100);
    expect(getOutlierGraphics(chart).length).toBeGreaterThanOrEqual(2);
  });

  test('clears outlier points and renders them again after a later updateDataSync', () => {
    const chart = render(createIssueSpec({ values: issueValues }));
    expect(getOutlierGraphics(chart).length).toBeGreaterThanOrEqual(3);

    chart.updateDataSync('boxPlot', []);
    expect(getFoldedOutlierValues(getSeries(chart))).toEqual([]);
    expect(getOutlierGraphics(chart)).toHaveLength(0);

    chart.updateDataSync('boxPlot', extremeValues);
    expect(getFoldedOutlierValues(getSeries(chart))).toEqual([12.01, 100]);
    expect(getLinearDomain(chart)[1]).toBeGreaterThanOrEqual(100);
    expect(getOutlierGraphics(chart).length).toBeGreaterThanOrEqual(2);
  });

  test('does not register an outliers statistic when outliersField is unset', () => {
    const chart = render(createIssueSpec({ values: extremeValues, outliersField: undefined }));

    expect(getOutlierStatistic(chart)).toBeUndefined();
    expect(getOutlierGraphics(chart)).toHaveLength(0);
    expect(getLinearDomain(chart)[1]).toBeLessThan(100);
  });
});
