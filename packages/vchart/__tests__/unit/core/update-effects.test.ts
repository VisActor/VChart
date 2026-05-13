import VChart, {
  type IBarChartSpec,
  type IBoxPlotChartSpec,
  type ICircularProgressChartSpec,
  type IHeatmapChartSpec,
  type ILineChartSpec,
  type ILinearProgressChartSpec,
  type IPieChartSpec,
  type IScatterChartSpec,
  type IWaterfallChartSpec
} from '../../../src';
import { isUpdateSpecResultLocalOnly } from '../../../src/chart/util';
import type { IUpdateSpecResult } from '../../../src/model/interface';
import { createDiv, removeDom } from '../../util/dom';

type VChartInternals = {
  _renderSync: (option?: unknown) => unknown;
  _chart: unknown;
  _updateSpec: (spec: unknown, forceMerge?: boolean) => IUpdateSpecResult;
  _updateModelSpec: (model: TestModel, spec: unknown, sync?: boolean) => unknown;
};

type TestModel = {
  updateSpec: jest.Mock<IUpdateSpecResult, [unknown]>;
  reInit: jest.Mock<void, [unknown]>;
};

type TestSeries = {
  reInit: (spec?: unknown) => void;
  getSpec: () => { calculationMode?: string };
};

type TestChartModel = {
  getAllSeries: () => TestSeries[];
  getComponentsByKey: (key: string) => Array<{ position?: string; getScale?: () => { domain: () => unknown[] } }>;
  updateDataSpec: () => void;
  updateGlobalScaleDomain: () => void;
  reDataFlow: () => void;
};

const getChartModel = (chart: VChart) => chart.getChart() as unknown as TestChartModel;

const spyOnDataStages = (chart: VChart) => {
  const chartModel = getChartModel(chart);

  return {
    chartModel,
    updateDataSpec: jest.spyOn(chartModel, 'updateDataSpec'),
    updateGlobalScaleDomain: jest.spyOn(chartModel, 'updateGlobalScaleDomain')
  };
};

const expectDataStagesSkipped = (spies: ReturnType<typeof spyOnDataStages>) => {
  expect(spies.updateDataSpec).not.toHaveBeenCalled();
  expect(spies.updateGlobalScaleDomain).not.toHaveBeenCalled();
};

const expectDataStagesRunOnce = (spies: ReturnType<typeof spyOnDataStages>) => {
  expect(spies.updateDataSpec).toHaveBeenCalledTimes(1);
  expect(spies.updateGlobalScaleDomain).toHaveBeenCalledTimes(1);
};

const spyOnFirstSeriesReInit = (chartModel: TestChartModel) => jest.spyOn(chartModel.getAllSeries()[0], 'reInit');

const createSpec = (): IBarChartSpec => ({
  type: 'bar',
  data: [{ id: 'data', values: [{ x: 'A', y: 1 }] }],
  xField: 'x',
  yField: 'y'
});

const createTitledSpec = (title: string): IBarChartSpec => ({
  ...createSpec(),
  title: {
    visible: true,
    text: title
  }
});

const createAxisAppearanceSpec = (options?: { alternateColor?: string[]; labelFill?: string }): IBarChartSpec => ({
  ...createSpec(),
  axes: [
    {
      orient: 'bottom',
      type: 'band'
    },
    {
      orient: 'left',
      type: 'linear',
      grid: {
        visible: true,
        alternateColor: options?.alternateColor
      },
      label: options?.labelFill
        ? {
            style: {
              fill: options.labelFill
            }
          }
        : undefined
    }
  ]
});

const createLegendAppearanceSpec = (
  labelFill: string,
  position: 'start' | 'middle' | 'end' = 'middle',
  defaultSelected?: string[],
  options?: { filter?: boolean; titleText?: string }
): IBarChartSpec => {
  const spec = {
    type: 'bar',
    data: [
      {
        id: 'data',
        values: [
          { x: 'A', y: 1 },
          { x: 'B', y: 2 }
        ]
      }
    ],
    xField: 'x',
    yField: 'y',
    seriesField: 'x',
    legends: [
      {
        visible: true,
        orient: 'bottom',
        position,
        defaultSelected,
        filter: options?.filter,
        title: options?.titleText
          ? {
              visible: true,
              text: options.titleText
            }
          : undefined,
        item: {
          label: {
            style: {
              fill: labelFill
            }
          }
        }
      }
    ]
  };

  return spec as unknown as IBarChartSpec;
};

const createSeriesLabelSpec = (position: 'top' | 'inside' = 'top'): IBarChartSpec =>
  ({
    type: 'bar',
    data: [{ id: 'data', values: [{ x: 'A', y: 1 }] }],
    series: [
      {
        type: 'bar',
        xField: 'x',
        yField: 'y',
        label: {
          visible: true,
          position
        }
      }
    ],
    axes: [
      {
        orient: 'bottom',
        type: 'band'
      },
      {
        orient: 'left',
        type: 'linear'
      }
    ]
  } as unknown as IBarChartSpec);

const createSeriesAnimationSpec = (duration: number): IBarChartSpec =>
  ({
    type: 'bar',
    data: [{ id: 'data', values: [{ x: 'A', y: 1 }] }],
    series: [
      {
        type: 'bar',
        xField: 'x',
        yField: 'y',
        animationUpdate: {
          duration
        }
      }
    ]
  } as unknown as IBarChartSpec);

const createSeriesFieldSpec = (xField: string): IBarChartSpec =>
  ({
    type: 'bar',
    data: [
      {
        id: 'data',
        values: [
          {
            x: 'A',
            category: 'B',
            y: 1
          }
        ]
      }
    ],
    series: [
      {
        type: 'bar',
        xField,
        yField: 'y'
      }
    ],
    axes: [
      {
        orient: 'bottom',
        type: 'band'
      },
      {
        orient: 'left',
        type: 'linear'
      }
    ]
  } as unknown as IBarChartSpec);

const createTopLevelLabelSpec = (position: 'top' | 'inside' = 'top'): IBarChartSpec => ({
  type: 'bar',
  data: [{ id: 'data', values: [{ x: 'A', y: 1 }] }],
  xField: 'x',
  yField: 'y',
  label: {
    visible: true,
    position
  },
  axes: [
    {
      orient: 'bottom',
      type: 'band'
    },
    {
      orient: 'left',
      type: 'linear'
    }
  ]
});

const createTopLevelAnimationSpec = (duration: number): IBarChartSpec => ({
  type: 'bar',
  data: [{ id: 'data', values: [{ x: 'A', y: 1 }] }],
  xField: 'x',
  yField: 'y',
  animationUpdate: {
    duration
  }
});

const createTopLevelTotalLabelSpec = (fill: string): IBarChartSpec => ({
  type: 'bar',
  data: [
    {
      id: 'data',
      values: [
        { x: 'A', group: 'G1', y: 1 },
        { x: 'A', group: 'G2', y: 2 }
      ]
    }
  ],
  xField: 'x',
  yField: 'y',
  seriesField: 'group',
  stack: true,
  totalLabel: {
    visible: true,
    style: {
      fill
    }
  }
});

const createTopLevelStackCornerRadiusSpec = (stackCornerRadius: () => number): IBarChartSpec => ({
  type: 'bar',
  data: [
    {
      id: 'data',
      values: [
        { x: 'A', group: 'G1', y: 1 },
        { x: 'A', group: 'G2', y: 2 }
      ]
    }
  ],
  xField: 'x',
  yField: 'y',
  seriesField: 'group',
  stack: true,
  stackCornerRadius
});

const createTopLevelBarWidthSpec = (barWidth: number): IBarChartSpec => ({
  type: 'bar',
  data: [{ id: 'data', values: [{ x: 'A', y: 1 }] }],
  xField: 'x',
  yField: 'y',
  barWidth
});

const createTopLevelLineSamplingSpec = (samplingFactor: number): ILineChartSpec => ({
  type: 'line',
  data: [
    {
      id: 'data',
      values: [
        { x: 'A', y: 1 },
        { x: 'B', y: 2 },
        { x: 'C', y: 3 }
      ]
    }
  ],
  xField: 'x',
  yField: 'y',
  sampling: 'lttb',
  samplingFactor
});

const createTopLevelLineLabelAndUnusedBarWidthSpec = (barWidth: number, position: 'top' | 'inside'): ILineChartSpec =>
  ({
    type: 'line',
    data: [
      {
        id: 'data',
        values: [
          { x: 'A', y: 1 },
          { x: 'B', y: 2 }
        ]
      }
    ],
    xField: 'x',
    yField: 'y',
    barWidth,
    label: {
      visible: true,
      position
    }
  } as unknown as ILineChartSpec);

const createTopLevelBoxPlotWidthSpec = (boxWidth: number): IBoxPlotChartSpec => ({
  type: 'boxPlot',
  data: [
    {
      id: 'data',
      values: [
        { x: 'A', min: 1, q1: 2, median: 3, q3: 4, max: 5 },
        { x: 'B', min: 2, q1: 3, median: 4, q3: 5, max: 6 }
      ]
    }
  ],
  xField: 'x',
  minField: 'min',
  q1Field: 'q1',
  medianField: 'median',
  q3Field: 'q3',
  maxField: 'max',
  boxWidth
});

const createTopLevelLinearProgressBandWidthSpec = (bandWidth: number): ILinearProgressChartSpec => ({
  type: 'linearProgress',
  data: [
    {
      id: 'data',
      values: [{ x: 'A', y: 0.6 }]
    }
  ],
  xField: 'y',
  yField: 'x',
  bandWidth
});

const createTopLevelLinearProgressProgressPaddingSpec = (
  topPadding: number,
  bottomPadding: number
): ILinearProgressChartSpec => ({
  type: 'linearProgress',
  data: [
    {
      id: 'data',
      values: [{ x: 'A', y: 0.6 }]
    }
  ],
  xField: 'y',
  yField: 'x',
  bandWidth: 10,
  progress: {
    topPadding,
    bottomPadding
  }
});

const createTopLevelCircularProgressCornerRadiusSpec = (cornerRadius: number): ICircularProgressChartSpec => ({
  type: 'circularProgress',
  data: [
    {
      id: 'data',
      values: [{ category: 'A', value: 0.6 }]
    }
  ],
  categoryField: 'category',
  valueField: 'value',
  cornerRadius
});

const createTopLevelHeatmapValueFieldSpec = (valueField: 'v1' | 'v2'): IHeatmapChartSpec => ({
  type: 'heatmap',
  data: [
    {
      id: 'data',
      values: [
        { x: 'A', y: 'K1', v1: 1, v2: 2 },
        { x: 'B', y: 'K1', v1: 3, v2: 4 }
      ]
    }
  ],
  xField: 'x',
  yField: 'y',
  valueField
});

const createTopLevelPieValueFieldSpec = (valueField: 'v1' | 'v2'): IPieChartSpec => ({
  type: 'pie',
  data: [
    {
      id: 'data',
      values: [
        { category: 'A', v1: 1, v2: 3 },
        { category: 'B', v1: 1, v2: 1 }
      ]
    }
  ],
  categoryField: 'category',
  valueField
});

const createTopLevelPieStartAngleSpec = (startAngle: number): IPieChartSpec => ({
  type: 'pie',
  data: [
    {
      id: 'data',
      values: [
        { category: 'A', value: 1 },
        { category: 'B', value: 1 }
      ]
    }
  ],
  categoryField: 'category',
  valueField: 'value',
  startAngle,
  endAngle: startAngle + 360
});

const createTopLevelPieMinAngleSpec = (minAngle: number): IPieChartSpec => ({
  type: 'pie',
  data: [
    {
      id: 'data',
      values: [
        { category: 'A', value: 1 },
        { category: 'B', value: 100 }
      ]
    }
  ],
  categoryField: 'category',
  valueField: 'value',
  minAngle
});

const createTopLevelPieOuterRadiusSpec = (outerRadius: number): IPieChartSpec => ({
  type: 'pie',
  data: [
    {
      id: 'data',
      values: [
        { category: 'A', value: 1 },
        { category: 'B', value: 1 }
      ]
    }
  ],
  categoryField: 'category',
  valueField: 'value',
  outerRadius
});

const createTopLevelWaterfallCalculationModeSpec = (calculationMode: 'increase' | 'decrease'): IWaterfallChartSpec => ({
  type: 'waterfall',
  data: [
    {
      id: 'data',
      values: [
        { x: 'A', y: 3 },
        { x: 'B', y: 1 },
        { x: 'C', y: 2 }
      ]
    }
  ],
  xField: 'x',
  yField: 'y',
  calculationMode
});

const createTopLevelScatterSizeFieldSpec = (sizeField: 's1' | 's2'): IScatterChartSpec => ({
  type: 'scatter',
  data: [
    {
      id: 'data',
      values: [
        { x: 'A', y: 1, s1: 1, s2: 2 },
        { x: 'B', y: 2, s1: 2, s2: 1 }
      ]
    }
  ],
  xField: 'x',
  yField: 'y',
  size: [10, 20],
  sizeField
});

const getFirstBarGraphic = (chart: VChart) => {
  const barSeries = chart
    .getChart()
    ?.getAllSeries()
    .find(series => series.type === 'bar');
  const barMark = barSeries?.getMarks().find(mark => mark.name === 'bar');
  const barGraphic = barMark?.getGraphics()[0] as { attribute: { width?: number } } | undefined;

  expect(barGraphic).toBeDefined();
  return barGraphic as { attribute: { width?: number } };
};

const getFirstBoxPlotGraphic = (chart: VChart) => {
  const boxPlotSeries = chart
    .getChart()
    ?.getAllSeries()
    .find(series => series.type === 'boxPlot');
  const boxPlotMark = boxPlotSeries?.getMarks().find(mark => mark.name === 'boxPlot');
  const boxPlotGraphic = boxPlotMark?.getGraphics()[0] as { attribute: { boxWidth?: number } } | undefined;

  expect(boxPlotGraphic).toBeDefined();
  return boxPlotGraphic as { attribute: { boxWidth?: number } };
};

const getFirstLinearProgressGraphic = (chart: VChart) => {
  const linearProgressSeries = chart
    .getChart()
    ?.getAllSeries()
    .find(series => series.type === 'linearProgress');
  const progressMark = linearProgressSeries?.getMarks().find(mark => mark.name === 'progress');
  const progressGraphic = progressMark?.getGraphics()[0] as { attribute: { height?: number } } | undefined;

  expect(progressGraphic).toBeDefined();
  return progressGraphic as { attribute: { height?: number } };
};

const getFirstCircularProgressGraphic = (chart: VChart) => {
  const circularProgressSeries = chart
    .getChart()
    ?.getAllSeries()
    .find(series => series.type === 'circularProgress');
  const progressMark = circularProgressSeries?.getMarks().find(mark => mark.name === 'progress');
  const progressGraphic = progressMark?.getGraphics()[0] as { attribute: { cornerRadius?: number } } | undefined;

  expect(progressGraphic).toBeDefined();
  return progressGraphic as { attribute: { cornerRadius?: number } };
};

const getFirstPieGraphic = (chart: VChart) => {
  const pieSeries = chart
    .getChart()
    ?.getAllSeries()
    .find(series => series.type === 'pie');
  const pieMark = pieSeries?.getMarks().find(mark => mark.name === 'pie');
  const pieGraphic = pieMark?.getGraphics()[0] as
    | { attribute: { startAngle?: number; endAngle?: number; outerRadius?: number } }
    | undefined;

  expect(pieGraphic).toBeDefined();
  return pieGraphic as { attribute: { startAngle?: number; endAngle?: number; outerRadius?: number } };
};

const getFirstScatterGraphic = (chart: VChart) => {
  const scatterSeries = chart
    .getChart()
    ?.getAllSeries()
    .find(series => series.type === 'scatter');
  const pointMark = scatterSeries?.getMarks().find(mark => mark.name === 'point');
  const pointGraphic = pointMark?.getGraphics()[0] as { attribute: { size?: number } } | undefined;

  expect(pointGraphic).toBeDefined();
  return pointGraphic as { attribute: { size?: number } };
};

const createTopLevelFieldSpec = (xField: string): IBarChartSpec => ({
  type: 'bar',
  data: [
    {
      id: 'data',
      values: [
        {
          x: 'A',
          category: 'B',
          y: 1
        }
      ]
    }
  ],
  xField,
  yField: 'y',
  axes: [
    {
      orient: 'bottom',
      type: 'band'
    },
    {
      orient: 'left',
      type: 'linear'
    }
  ]
});

const createModelSpec = (): IBarChartSpec => ({
  ...createSpec(),
  title: {
    id: 'chart-title',
    visible: true,
    text: 'before'
  },
  axes: [
    {
      orient: 'bottom',
      type: 'band'
    },
    {
      id: 'axis-left',
      orient: 'left',
      type: 'linear',
      nice: false,
      zero: false,
      label: {
        style: {
          fill: '#333'
        }
      }
    }
  ]
});

describe('vchart scoped update effects', () => {
  let container: HTMLElement;
  let dom: HTMLElement;

  beforeEach(() => {
    container = createDiv();
    dom = createDiv(container);
  });

  afterEach(() => {
    removeDom(container);
  });

  it('skips render for explicit local-only updates', () => {
    const chart = new VChart(createSpec(), { dom, animation: false });
    const renderSync = jest.spyOn(chart as unknown as VChartInternals, '_renderSync');

    try {
      chart.updateCustomConfigAndRerender(
        { change: true, reMake: false, effects: { localOnly: true, component: true } },
        true
      );

      expect(renderSync).not.toHaveBeenCalled();
    } finally {
      renderSync.mockRestore();
      chart.release();
    }
  });

  it('keeps legacy change-only updates rendering', () => {
    const chart = new VChart(createSpec(), { dom, animation: false });
    const renderSync = jest.spyOn(chart as unknown as VChartInternals, '_renderSync').mockReturnValue(chart);

    try {
      chart.updateCustomConfigAndRerender({ change: true, reMake: false }, true);

      expect(renderSync).toHaveBeenCalledTimes(1);
    } finally {
      renderSync.mockRestore();
      chart.release();
    }
  });

  it('keeps local-only predicate from mutating legacy results', () => {
    const result: IUpdateSpecResult = {
      change: false,
      reMake: false,
      reRender: true,
      reSize: false,
      reCompile: false
    };

    expect(isUpdateSpecResultLocalOnly(result)).toBe(false);
    expect(result.effects).toBeUndefined();
  });

  it('skips series data stages for title text-only updates', () => {
    const chart = new VChart(createTitledSpec('before'), { dom, animation: false });
    const renderSync = jest.spyOn(chart as unknown as VChartInternals, '_renderSync');

    try {
      chart.renderSync();
      renderSync.mockClear();

      const spies = spyOnDataStages(chart);
      const seriesReInit = spyOnFirstSeriesReInit(spies.chartModel);

      chart.updateSpecSync(createTitledSpec('after'));

      expect(renderSync).toHaveBeenCalledTimes(1);
      expect(seriesReInit).not.toHaveBeenCalled();
      expectDataStagesSkipped(spies);
    } finally {
      renderSync.mockRestore();
      chart.release();
    }
  });

  it('skips series data stages for axis appearance-only updates', () => {
    const chart = new VChart(createAxisAppearanceSpec(), { dom, animation: false });
    const renderSync = jest.spyOn(chart as unknown as VChartInternals, '_renderSync');

    try {
      chart.renderSync();
      renderSync.mockClear();

      const spies = spyOnDataStages(chart);
      const seriesReInit = spyOnFirstSeriesReInit(spies.chartModel);

      chart.updateSpecSync(createAxisAppearanceSpec({ alternateColor: ['pink', 'green'] }));

      expect(renderSync).toHaveBeenCalledTimes(1);
      expect(seriesReInit).not.toHaveBeenCalled();
      expectDataStagesSkipped(spies);
    } finally {
      renderSync.mockRestore();
      chart.release();
    }
  });

  it('skips series data stages for axis label style-only updates', () => {
    const chart = new VChart(createAxisAppearanceSpec({ labelFill: '#333' }), { dom, animation: false });
    const renderSync = jest.spyOn(chart as unknown as VChartInternals, '_renderSync');

    try {
      chart.renderSync();
      renderSync.mockClear();

      const spies = spyOnDataStages(chart);
      const seriesReInit = spyOnFirstSeriesReInit(spies.chartModel);

      chart.updateSpecSync(createAxisAppearanceSpec({ labelFill: '#666' }));

      expect(renderSync).toHaveBeenCalledTimes(1);
      expect(seriesReInit).not.toHaveBeenCalled();
      expectDataStagesSkipped(spies);
    } finally {
      renderSync.mockRestore();
      chart.release();
    }
  });

  it('keeps axis min max updates on the series data path', () => {
    const chart = new VChart(createAxisAppearanceSpec(), { dom, animation: false });

    try {
      chart.renderSync();

      const spies = spyOnDataStages(chart);

      chart.updateSpecSync({
        ...createAxisAppearanceSpec(),
        axes: [
          {
            orient: 'bottom',
            type: 'band'
          },
          {
            orient: 'left',
            type: 'linear',
            grid: {
              visible: true
            },
            min: -10,
            max: 10
          }
        ]
      });

      expectDataStagesRunOnce(spies);
    } finally {
      chart.release();
    }
  });

  it('keeps axis scale option updates on the series data path', () => {
    const chart = new VChart(createAxisAppearanceSpec(), { dom, animation: false });

    try {
      chart.renderSync();

      const spies = spyOnDataStages(chart);

      chart.updateSpecSync({
        ...createAxisAppearanceSpec(),
        axes: [
          {
            orient: 'bottom',
            type: 'band'
          },
          {
            orient: 'left',
            type: 'linear',
            grid: {
              visible: true
            },
            nice: false,
            zero: false
          }
        ]
      });

      expectDataStagesRunOnce(spies);
    } finally {
      chart.release();
    }
  });

  it('keeps axis domain updates on the series data path', () => {
    const chart = new VChart(createAxisAppearanceSpec(), { dom, animation: false });

    try {
      chart.renderSync();

      const spies = spyOnDataStages(chart);

      chart.updateSpecSync({
        ...createAxisAppearanceSpec(),
        axes: [
          {
            orient: 'bottom',
            type: 'band',
            domain: ['A']
          },
          {
            orient: 'left',
            type: 'linear',
            grid: {
              visible: true
            }
          }
        ]
      });

      expectDataStagesRunOnce(spies);
    } finally {
      chart.release();
    }
  });

  it('keeps axis series binding updates on the structural remake path', () => {
    const chart = new VChart(createAxisAppearanceSpec(), { dom, animation: false });

    try {
      chart.renderSync();

      const nextSpec = {
        ...createAxisAppearanceSpec(),
        axes: [
          {
            orient: 'bottom',
            type: 'band'
          },
          {
            orient: 'left',
            type: 'linear',
            grid: {
              visible: true
            },
            seriesId: ['bar-series']
          }
        ]
      };
      const updateResult = (chart as unknown as VChartInternals)._updateSpec(nextSpec, false);

      expect(updateResult.reMake).toBe(true);
      expect(updateResult.effects?.component).toBeUndefined();
    } finally {
      chart.release();
    }
  });

  it('skips series data stages for legend appearance-only updates', () => {
    const chart = new VChart(createLegendAppearanceSpec('red'), { dom, animation: false });
    const renderSync = jest.spyOn(chart as unknown as VChartInternals, '_renderSync');

    try {
      chart.renderSync();
      renderSync.mockClear();

      const spies = spyOnDataStages(chart);
      const seriesReInit = spyOnFirstSeriesReInit(spies.chartModel);

      chart.updateSpecSync(createLegendAppearanceSpec('blue'));

      expect(renderSync).toHaveBeenCalledTimes(1);
      expect(seriesReInit).not.toHaveBeenCalled();
      expectDataStagesSkipped(spies);
    } finally {
      renderSync.mockRestore();
      chart.release();
    }
  });

  it('skips series data stages for legend position-only updates', () => {
    const chart = new VChart(createLegendAppearanceSpec('red', 'middle'), { dom, animation: false });
    const renderSync = jest.spyOn(chart as unknown as VChartInternals, '_renderSync');

    try {
      chart.renderSync();
      renderSync.mockClear();

      const spies = spyOnDataStages(chart);
      const seriesReInit = spyOnFirstSeriesReInit(spies.chartModel);

      chart.updateSpecSync(createLegendAppearanceSpec('red', 'end'));

      expect(spies.chartModel.getComponentsByKey('legends')[0]?.position).toBe('end');
      expect(renderSync).toHaveBeenCalledTimes(1);
      expect(seriesReInit).not.toHaveBeenCalled();
      expectDataStagesSkipped(spies);
    } finally {
      renderSync.mockRestore();
      chart.release();
    }
  });

  it('skips series data stages for legend title-only updates', () => {
    const chart = new VChart(createLegendAppearanceSpec('red', 'middle', undefined, { titleText: 'before' }), {
      dom,
      animation: false
    });
    const renderSync = jest.spyOn(chart as unknown as VChartInternals, '_renderSync');

    try {
      chart.renderSync();
      renderSync.mockClear();

      const spies = spyOnDataStages(chart);
      const seriesReInit = spyOnFirstSeriesReInit(spies.chartModel);

      chart.updateSpecSync(createLegendAppearanceSpec('red', 'middle', undefined, { titleText: 'after' }));

      expect(renderSync).toHaveBeenCalledTimes(1);
      expect(seriesReInit).not.toHaveBeenCalled();
      expectDataStagesSkipped(spies);
    } finally {
      renderSync.mockRestore();
      chart.release();
    }
  });

  it('keeps legend defaultSelected updates on the series data path', () => {
    const chart = new VChart(createLegendAppearanceSpec('red'), { dom, animation: false });

    try {
      chart.renderSync();

      const spies = spyOnDataStages(chart);

      chart.updateSpecSync(createLegendAppearanceSpec('red', 'middle', ['A']));

      expectDataStagesRunOnce(spies);
    } finally {
      chart.release();
    }
  });

  it('keeps legend filter updates on the series data path', () => {
    const chart = new VChart(createLegendAppearanceSpec('red', 'middle', undefined, { filter: true }), {
      dom,
      animation: false
    });

    try {
      chart.renderSync();

      const spies = spyOnDataStages(chart);

      chart.updateSpecSync(createLegendAppearanceSpec('red', 'middle', undefined, { filter: false }));

      expectDataStagesRunOnce(spies);
    } finally {
      chart.release();
    }
  });

  it('skips chart data stages for series label appearance-only updates', () => {
    const chart = new VChart(createSeriesLabelSpec('top'), { dom, animation: false });

    try {
      chart.renderSync();

      const spies = spyOnDataStages(chart);

      chart.updateSpecSync(createSeriesLabelSpec('inside'));

      expectDataStagesSkipped(spies);
    } finally {
      chart.release();
    }
  });

  it('skips chart data stages for series animation-only updates', () => {
    const chart = new VChart(createSeriesAnimationSpec(100), { dom, animation: false });

    try {
      chart.renderSync();

      const spies = spyOnDataStages(chart);

      chart.updateSpecSync(createSeriesAnimationSpec(200));

      expectDataStagesSkipped(spies);
    } finally {
      chart.release();
    }
  });

  it('keeps series field updates on the chart data path', () => {
    const chart = new VChart(createSeriesFieldSpec('x'), { dom, animation: false });

    try {
      chart.renderSync();

      const spies = spyOnDataStages(chart);

      chart.updateSpecSync(createSeriesFieldSpec('category'));

      expectDataStagesRunOnce(spies);
    } finally {
      chart.release();
    }
  });

  it('skips chart data stages for top-level label appearance-only updates', () => {
    const chart = new VChart(createTopLevelLabelSpec('top'), { dom, animation: false });

    try {
      chart.renderSync();

      const spies = spyOnDataStages(chart);

      chart.updateSpecSync(createTopLevelLabelSpec('inside'));

      expectDataStagesSkipped(spies);
    } finally {
      chart.release();
    }
  });

  it('skips chart data stages for top-level animation-only updates', () => {
    const chart = new VChart(createTopLevelAnimationSpec(100), { dom, animation: false });

    try {
      chart.renderSync();

      const spies = spyOnDataStages(chart);

      chart.updateSpecSync(createTopLevelAnimationSpec(200));

      expectDataStagesSkipped(spies);
    } finally {
      chart.release();
    }
  });

  it('skips chart data stages for top-level totalLabel appearance-only updates', () => {
    const chart = new VChart(createTopLevelTotalLabelSpec('#333'), { dom, animation: false });

    try {
      chart.renderSync();

      const spies = spyOnDataStages(chart);

      chart.updateSpecSync(createTopLevelTotalLabelSpec('#666'));

      expectDataStagesSkipped(spies);
    } finally {
      chart.release();
    }
  });

  it('skips chart data stages and reapplies top-level stackCornerRadius callback updates', () => {
    const beforeRadius = jest.fn(() => 4);
    const afterRadius = jest.fn(() => 8);
    const chart = new VChart(createTopLevelStackCornerRadiusSpec(beforeRadius), { dom, animation: false });

    try {
      chart.renderSync();
      beforeRadius.mockClear();

      const spies = spyOnDataStages(chart);
      const seriesReInit = spyOnFirstSeriesReInit(spies.chartModel);

      chart.updateSpecSync(createTopLevelStackCornerRadiusSpec(afterRadius));

      expect(seriesReInit).toHaveBeenCalledTimes(1);
      expect(beforeRadius).not.toHaveBeenCalled();
      expect(afterRadius).toHaveBeenCalled();
      expectDataStagesSkipped(spies);
    } finally {
      chart.release();
    }
  });

  it('skips chart data stages and reapplies top-level barWidth updates', () => {
    const chart = new VChart(createTopLevelBarWidthSpec(10), { dom, animation: false });

    try {
      chart.renderSync();

      expect(getFirstBarGraphic(chart).attribute.width).toBe(10);

      const spies = spyOnDataStages(chart);
      const seriesReInit = spyOnFirstSeriesReInit(spies.chartModel);

      chart.updateSpecSync(createTopLevelBarWidthSpec(20));

      expect(seriesReInit).toHaveBeenCalledTimes(1);
      expect(getFirstBarGraphic(chart).attribute.width).toBe(20);
      expectDataStagesSkipped(spies);
    } finally {
      chart.release();
    }
  });

  it('keeps top-level line sampling updates on the chart data path', () => {
    const chart = new VChart(createTopLevelLineSamplingSpec(1), { dom, animation: false });

    try {
      chart.renderSync();

      const spies = spyOnDataStages(chart);
      const seriesReInit = spyOnFirstSeriesReInit(spies.chartModel);

      chart.updateSpecSync(createTopLevelLineSamplingSpec(2));

      expect(seriesReInit).toHaveBeenCalledTimes(1);
      expectDataStagesRunOnce(spies);
    } finally {
      chart.release();
    }
  });

  it('keeps chart data stages when a chart-foreign series key changes with line label', () => {
    const chart = new VChart(createTopLevelLineLabelAndUnusedBarWidthSpec(10, 'top'), {
      dom,
      animation: false
    });

    try {
      chart.renderSync();

      const spies = spyOnDataStages(chart);

      chart.updateSpecSync(createTopLevelLineLabelAndUnusedBarWidthSpec(20, 'inside'));

      expectDataStagesRunOnce(spies);
    } finally {
      chart.release();
    }
  });

  it('skips chart data stages and reapplies top-level boxPlot boxWidth updates', () => {
    const chart = new VChart(createTopLevelBoxPlotWidthSpec(10), { dom, animation: false });

    try {
      chart.renderSync();

      expect(getFirstBoxPlotGraphic(chart).attribute.boxWidth).toBe(10);

      const spies = spyOnDataStages(chart);
      const seriesReInit = spyOnFirstSeriesReInit(spies.chartModel);

      chart.updateSpecSync(createTopLevelBoxPlotWidthSpec(20));

      expect(seriesReInit).toHaveBeenCalledTimes(1);
      expect(getFirstBoxPlotGraphic(chart).attribute.boxWidth).toBe(20);
      expectDataStagesSkipped(spies);
    } finally {
      chart.release();
    }
  });

  it('skips chart data stages and reapplies top-level linearProgress bandWidth updates', () => {
    const chart = new VChart(createTopLevelLinearProgressBandWidthSpec(10), { dom, animation: false });

    try {
      chart.renderSync();

      expect(getFirstLinearProgressGraphic(chart).attribute.height).toBe(10);

      const spies = spyOnDataStages(chart);
      const seriesReInit = spyOnFirstSeriesReInit(spies.chartModel);

      chart.updateSpecSync(createTopLevelLinearProgressBandWidthSpec(20));

      expect(seriesReInit).toHaveBeenCalledTimes(1);
      expect(getFirstLinearProgressGraphic(chart).attribute.height).toBe(20);
      expectDataStagesSkipped(spies);
    } finally {
      chart.release();
    }
  });

  it('skips chart data stages and reapplies top-level linearProgress progress padding updates', () => {
    const chart = new VChart(createTopLevelLinearProgressProgressPaddingSpec(1, 1), { dom, animation: false });

    try {
      chart.renderSync();

      expect(getFirstLinearProgressGraphic(chart).attribute.height).toBe(8);

      const spies = spyOnDataStages(chart);
      const seriesReInit = spyOnFirstSeriesReInit(spies.chartModel);

      chart.updateSpecSync(createTopLevelLinearProgressProgressPaddingSpec(2, 2));

      expect(seriesReInit).toHaveBeenCalledTimes(1);
      expect(getFirstLinearProgressGraphic(chart).attribute.height).toBe(6);
      expectDataStagesSkipped(spies);
    } finally {
      chart.release();
    }
  });

  it('skips chart data stages and reapplies top-level circularProgress cornerRadius updates', () => {
    const chart = new VChart(createTopLevelCircularProgressCornerRadiusSpec(0), { dom, animation: false });

    try {
      chart.renderSync();

      expect(getFirstCircularProgressGraphic(chart).attribute.cornerRadius).toBe(0);

      const spies = spyOnDataStages(chart);
      const seriesReInit = spyOnFirstSeriesReInit(spies.chartModel);

      chart.updateSpecSync(createTopLevelCircularProgressCornerRadiusSpec(8));

      expect(seriesReInit).toHaveBeenCalledTimes(1);
      expect(getFirstCircularProgressGraphic(chart).attribute.cornerRadius).toBe(8);
      expectDataStagesSkipped(spies);
    } finally {
      chart.release();
    }
  });

  it('keeps top-level heatmap valueField updates on the chart data path', () => {
    const chart = new VChart(createTopLevelHeatmapValueFieldSpec('v1'), { dom, animation: false });

    try {
      chart.renderSync();

      const spies = spyOnDataStages(chart);
      const seriesReInit = spyOnFirstSeriesReInit(spies.chartModel);

      chart.updateSpecSync(createTopLevelHeatmapValueFieldSpec('v2'));

      expect(seriesReInit).toHaveBeenCalledTimes(1);
      expect((spies.chartModel.getAllSeries()[0] as any).getFieldValue()).toEqual(['v2']);
      expectDataStagesRunOnce(spies);
    } finally {
      chart.release();
    }
  });

  it('keeps top-level pie valueField updates on the chart data path', () => {
    const chart = new VChart(createTopLevelPieValueFieldSpec('v1'), { dom, animation: false });

    try {
      chart.renderSync();

      const initialPieGraphic = getFirstPieGraphic(chart);
      expect(initialPieGraphic.attribute.endAngle - initialPieGraphic.attribute.startAngle).toBeCloseTo(Math.PI);

      const spies = spyOnDataStages(chart);
      const seriesReInit = spyOnFirstSeriesReInit(spies.chartModel);

      chart.updateSpecSync(createTopLevelPieValueFieldSpec('v2'));

      const updatedPieGraphic = getFirstPieGraphic(chart);
      expect(seriesReInit).toHaveBeenCalledTimes(1);
      expect(updatedPieGraphic.attribute.endAngle - updatedPieGraphic.attribute.startAngle).toBeCloseTo(Math.PI * 1.5);
      expectDataStagesRunOnce(spies);
    } finally {
      chart.release();
    }
  });

  it('keeps top-level pie startAngle updates on the chart data path', () => {
    const chart = new VChart(createTopLevelPieStartAngleSpec(0), { dom, animation: false });

    try {
      chart.renderSync();

      expect(getFirstPieGraphic(chart).attribute.startAngle).toBeCloseTo(0);

      const spies = spyOnDataStages(chart);
      const seriesReInit = spyOnFirstSeriesReInit(spies.chartModel);

      chart.updateSpecSync(createTopLevelPieStartAngleSpec(90));

      expect(seriesReInit).toHaveBeenCalledTimes(1);
      expect(getFirstPieGraphic(chart).attribute.startAngle).toBeCloseTo(Math.PI / 2);
      expectDataStagesRunOnce(spies);
    } finally {
      chart.release();
    }
  });

  it('keeps top-level pie minAngle updates on the chart data path', () => {
    const chart = new VChart(createTopLevelPieMinAngleSpec(0), { dom, animation: false });

    try {
      chart.renderSync();

      const initialPieGraphic = getFirstPieGraphic(chart);
      const initialAngle = initialPieGraphic.attribute.endAngle - initialPieGraphic.attribute.startAngle;
      expect(initialAngle).toBeLessThan(Math.PI / 6);

      const spies = spyOnDataStages(chart);
      const seriesReInit = spyOnFirstSeriesReInit(spies.chartModel);

      chart.updateSpecSync(createTopLevelPieMinAngleSpec(30));

      const updatedPieGraphic = getFirstPieGraphic(chart);
      expect(seriesReInit).toHaveBeenCalledTimes(1);
      expect(updatedPieGraphic.attribute.endAngle - updatedPieGraphic.attribute.startAngle).toBeCloseTo(Math.PI / 6);
      expectDataStagesRunOnce(spies);
    } finally {
      chart.release();
    }
  });

  it('skips chart data stages and reapplies top-level pie outerRadius updates', () => {
    const chart = new VChart(createTopLevelPieOuterRadiusSpec(0.5), { dom, animation: false });

    try {
      chart.renderSync();

      const initialOuterRadius = getFirstPieGraphic(chart).attribute.outerRadius;
      expect(initialOuterRadius).toBeGreaterThan(0);

      const spies = spyOnDataStages(chart);
      const seriesReInit = spyOnFirstSeriesReInit(spies.chartModel);

      chart.updateSpecSync(createTopLevelPieOuterRadiusSpec(0.8));

      expect(seriesReInit).toHaveBeenCalledTimes(1);
      expect(getFirstPieGraphic(chart).attribute.outerRadius).toBeCloseTo((initialOuterRadius / 0.5) * 0.8);
      expectDataStagesSkipped(spies);
    } finally {
      chart.release();
    }
  });

  it('keeps top-level scatter sizeField updates on the chart data path', () => {
    const chart = new VChart(createTopLevelScatterSizeFieldSpec('s1'), { dom, animation: false });

    try {
      chart.renderSync();

      expect(getFirstScatterGraphic(chart).attribute.size).toBe(10);

      const spies = spyOnDataStages(chart);
      const seriesReInit = spyOnFirstSeriesReInit(spies.chartModel);

      chart.updateSpecSync(createTopLevelScatterSizeFieldSpec('s2'));

      expect(seriesReInit).toHaveBeenCalledTimes(1);
      expect(getFirstScatterGraphic(chart).attribute.size).toBe(20);
      expectDataStagesRunOnce(spies);
    } finally {
      chart.release();
    }
  });

  it('keeps top-level waterfall calculationMode updates on the chart data path', () => {
    const chart = new VChart(createTopLevelWaterfallCalculationModeSpec('increase'), { dom, animation: false });

    try {
      chart.renderSync();

      const spies = spyOnDataStages(chart);
      const seriesReInit = spyOnFirstSeriesReInit(spies.chartModel);

      chart.updateSpecSync(createTopLevelWaterfallCalculationModeSpec('decrease'));

      expect(seriesReInit).toHaveBeenCalledTimes(1);
      expect(spies.chartModel.getAllSeries()[0].getSpec().calculationMode).toBe('decrease');
      expectDataStagesRunOnce(spies);
    } finally {
      chart.release();
    }
  });

  it('keeps top-level field updates on the chart data path', () => {
    const chart = new VChart(createTopLevelFieldSpec('x'), { dom, animation: false });

    try {
      chart.renderSync();

      const spies = spyOnDataStages(chart);

      chart.updateSpecSync(createTopLevelFieldSpec('category'));

      expectDataStagesRunOnce(spies);
    } finally {
      chart.release();
    }
  });

  it('skips chart dataflow for title updateModelSpec text-only updates', () => {
    const chart = new VChart(createModelSpec(), { dom, animation: false });

    try {
      chart.renderSync();

      const chartModel = getChartModel(chart);
      const reDataFlow = jest.spyOn(chartModel, 'reDataFlow');

      chart.updateModelSpecSync('chart-title', { text: 'after' }, true);

      expect(reDataFlow).not.toHaveBeenCalled();
    } finally {
      chart.release();
    }
  });

  it('skips chart dataflow for axis updateModelSpec appearance-only updates', () => {
    const chart = new VChart(createModelSpec(), { dom, animation: false });

    try {
      chart.renderSync();

      const chartModel = getChartModel(chart);
      const reDataFlow = jest.spyOn(chartModel, 'reDataFlow');

      chart.updateModelSpecSync('axis-left', { label: { style: { fill: '#666' } } }, true);

      expect(reDataFlow).not.toHaveBeenCalled();
    } finally {
      chart.release();
    }
  });

  it('keeps axis updateModelSpec domain updates on chart dataflow', () => {
    const chart = new VChart(createModelSpec(), { dom, animation: false });

    try {
      chart.renderSync();

      const chartModel = getChartModel(chart);
      const reDataFlow = jest.spyOn(chartModel, 'reDataFlow');

      chart.updateModelSpecSync('axis-left', { min: -10, max: 10 }, true);

      expect(reDataFlow).toHaveBeenCalledTimes(1);
      expect(chartModel.getComponentsByKey('axes')[1]?.getScale?.().domain()).toEqual([-10, 10]);
    } finally {
      chart.release();
    }
  });

  it('skips model reInit and chart dataflow for explicit local-only model updates', () => {
    const chart = new VChart(createSpec(), { dom, animation: false });
    const chartInternals = chart as unknown as VChartInternals;
    const model: TestModel = {
      updateSpec: jest.fn((_spec: unknown) => ({
        change: true,
        reMake: false,
        effects: { localOnly: true, component: true }
      })),
      reInit: jest.fn((_spec: unknown) => undefined)
    };
    const chartModel = { reDataFlow: jest.fn(), release: jest.fn() };
    const rerender = jest.spyOn(chart, 'updateCustomConfigAndRerender').mockReturnValue(chart);

    try {
      chartInternals._chart = chartModel;
      chartInternals._updateModelSpec(model, { visible: false }, true);

      expect(model.updateSpec).toHaveBeenCalledWith({ visible: false });
      expect(model.reInit).not.toHaveBeenCalled();
      expect(chartModel.reDataFlow).not.toHaveBeenCalled();
      expect(rerender).toHaveBeenCalled();
    } finally {
      rerender.mockRestore();
      chart.release();
    }
  });

  it('skips chart dataflow for component-only model updates', () => {
    const chart = new VChart(createSpec(), { dom, animation: false });
    const chartInternals = chart as unknown as VChartInternals;
    const model: TestModel = {
      updateSpec: jest.fn((_spec: unknown) => ({
        change: true,
        reMake: false,
        reRender: true,
        effects: { component: true, layout: true, render: true }
      })),
      reInit: jest.fn((_spec: unknown) => undefined)
    };
    const chartModel = { reDataFlow: jest.fn(), release: jest.fn() };
    const rerender = jest.spyOn(chart, 'updateCustomConfigAndRerender').mockReturnValue(chart);

    try {
      chartInternals._chart = chartModel;
      chartInternals._updateModelSpec(model, { text: 'after' }, true);

      expect(model.reInit).toHaveBeenCalledWith({ text: 'after' });
      expect(chartModel.reDataFlow).not.toHaveBeenCalled();
      expect(rerender).toHaveBeenCalled();
    } finally {
      rerender.mockRestore();
      chart.release();
    }
  });

  it('keeps legacy model updates running reInit and dataflow', () => {
    const chart = new VChart(createSpec(), { dom, animation: false });
    const chartInternals = chart as unknown as VChartInternals;
    const model: TestModel = {
      updateSpec: jest.fn((_spec: unknown) => ({ change: true, reMake: false })),
      reInit: jest.fn((_spec: unknown) => undefined)
    };
    const chartModel = { reDataFlow: jest.fn(), release: jest.fn() };
    const rerender = jest.spyOn(chart, 'updateCustomConfigAndRerender').mockReturnValue(chart);

    try {
      chartInternals._chart = chartModel;
      chartInternals._updateModelSpec(model, { visible: false }, true);

      expect(model.reInit).toHaveBeenCalledWith({ visible: false });
      expect(chartModel.reDataFlow).toHaveBeenCalledTimes(1);
      expect(rerender).toHaveBeenCalled();
    } finally {
      rerender.mockRestore();
      chart.release();
    }
  });
});
