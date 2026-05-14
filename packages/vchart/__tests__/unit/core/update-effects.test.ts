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

const expectComponentOnlyResult = (result: IUpdateSpecResult) => {
  expect(result.reMake).toBe(false);
  expect(result.reCompile).toBe(false);
  expect(result.effects).toMatchObject({
    component: true,
    render: true
  });
  expect(result.effects?.remake).toBeUndefined();
  expect(result.effects?.compile).toBeUndefined();
  expect(result.effects?.data).toBeUndefined();
  expect(result.effects?.scaleDomain).toBeUndefined();
  expect(result.effects?.series).toBeUndefined();
};

const expectComponentOnlySpecUpdate = (
  dom: HTMLElement,
  createInitialSpec: () => IBarChartSpec | ILineChartSpec,
  createNextSpec: () => IBarChartSpec | ILineChartSpec,
  options?: {
    layout?: boolean;
    beforeUpdate?: (chart: VChart) => unknown;
    afterUpdate?: (chart: VChart, ctx: unknown) => void;
  }
) => {
  const classifyChart = new VChart(createInitialSpec(), { dom, animation: false });

  try {
    classifyChart.renderSync();

    const result = (classifyChart as unknown as VChartInternals)._updateSpec(createNextSpec(), false);

    expectComponentOnlyResult(result);
    if (options?.layout) {
      expect(result.effects?.layout).toBe(true);
    }
  } finally {
    classifyChart.release();
  }

  const updateChart = new VChart(createInitialSpec(), { dom, animation: false });

  try {
    updateChart.renderSync();

    const spies = spyOnDataStages(updateChart);
    const seriesReInit = spyOnFirstSeriesReInit(spies.chartModel);
    const ctx = options?.beforeUpdate?.(updateChart);

    updateChart.updateSpecSync(createNextSpec());

    expect(seriesReInit).not.toHaveBeenCalled();
    expectDataStagesSkipped(spies);
    options?.afterUpdate?.(updateChart, ctx);
  } finally {
    updateChart.release();
  }
};

const expectSeriesCompileOnlyResult = (result: IUpdateSpecResult) => {
  expect(result.reMake).toBe(false);
  expect(result.reCompile).toBe(true);
  expect(result.effects).toMatchObject({
    series: true,
    compile: true,
    layout: true,
    render: true
  });
  expect(result.effects?.remake).toBeUndefined();
  expect(result.effects?.data).toBeUndefined();
  expect(result.effects?.scaleDomain).toBeUndefined();
  expect(result.effects?.component).toBeUndefined();
};

const expectSeriesCompileOnlySpecUpdate = (
  dom: HTMLElement,
  createInitialSpec: () => IBarChartSpec | ILineChartSpec | IPieChartSpec,
  createNextSpec: () => IBarChartSpec | ILineChartSpec | IPieChartSpec,
  afterUpdate?: (chart: VChart) => void
) => {
  const classifyChart = new VChart(createInitialSpec(), { dom, animation: false });

  try {
    classifyChart.renderSync();

    const result = (classifyChart as unknown as VChartInternals)._updateSpec(createNextSpec(), false);

    expectSeriesCompileOnlyResult(result);
  } finally {
    classifyChart.release();
  }

  const updateChart = new VChart(createInitialSpec(), { dom, animation: false });

  try {
    updateChart.renderSync();

    const spies = spyOnDataStages(updateChart);

    updateChart.updateSpecSync(createNextSpec());

    expectDataStagesSkipped(spies);
    afterUpdate?.(updateChart);
  } finally {
    updateChart.release();
  }
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

const createTopLevelBarStateFilterSpec = (filter: (datum: unknown) => boolean): IBarChartSpec => ({
  type: 'bar',
  data: [{ id: 'data', values: [{ x: 'A', y: 1 }] }],
  xField: 'x',
  yField: 'y',
  bar: {
    state: {
      custom: {
        filter,
        style: {
          fillOpacity: 0.4
        }
      }
    }
  }
});

const createTopLevelLineMarkStyleSpec = (stroke: string): ILineChartSpec => ({
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
  line: {
    style: {
      stroke
    }
  }
});

const createTopLevelLineMarkIdSpec = (id: string): ILineChartSpec => ({
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
  line: {
    id
  }
});

const createTopLevelPieStateFilterSpec = (filter: (datum: unknown) => boolean): IPieChartSpec => ({
  type: 'pie',
  data: [
    {
      id: 'data',
      values: [
        { category: 'A', value: 1 },
        { category: 'B', value: 2 }
      ]
    }
  ],
  categoryField: 'category',
  valueField: 'value',
  pie: {
    state: {
      custom: {
        filter,
        style: {
          outerRadius: 0.8
        }
      }
    }
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

const createDataZoomTextSpec = (formatMethod: (text: string | number) => string | string[]): IBarChartSpec =>
  ({
    ...createAxisAppearanceSpec(),
    dataZoom: [
      {
        orient: 'bottom',
        start: 0,
        end: 1,
        startText: {
          formatMethod
        }
      }
    ]
  } as unknown as IBarChartSpec);

const createScrollBarStyleSpec = (fill: string): IBarChartSpec =>
  ({
    ...createAxisAppearanceSpec(),
    scrollBar: [
      {
        orient: 'bottom',
        start: 0,
        end: 1,
        slider: {
          style: {
            fill
          }
        }
      }
    ]
  } as unknown as IBarChartSpec);

const createTooltipStyleSpec = (backgroundColor: string): IBarChartSpec =>
  ({
    ...createSpec(),
    tooltip: {
      visible: true,
      style: {
        panel: {
          backgroundColor
        }
      }
    }
  } as unknown as IBarChartSpec);

const createPlayerStyleSpec = (fill: string): IBarChartSpec =>
  ({
    ...createSpec(),
    player: {
      type: 'discrete',
      orient: 'bottom',
      specs: [{ data: [{ id: 'data', values: [{ x: 'A', y: 2 }] }] }],
      slider: {
        railStyle: {
          fill
        }
      }
    }
  } as unknown as IBarChartSpec);

const createIndicatorTextSpec = (text: string): IBarChartSpec =>
  ({
    ...createSpec(),
    indicator: {
      visible: true,
      fixed: true,
      title: {
        visible: true,
        style: {
          text
        }
      },
      content: [
        {
          visible: true,
          style: {
            text: 'content'
          }
        }
      ]
    }
  } as unknown as IBarChartSpec);

const createMarkerLabelFormatSpec = (formatMethod: (dataPoints: any[], seriesData: any[]) => string): IBarChartSpec =>
  ({
    ...createAxisAppearanceSpec(),
    markLine: [
      {
        y: 1,
        label: {
          formatMethod,
          position: 'insideEndTop'
        }
      }
    ]
  } as unknown as IBarChartSpec);

const createMarkPointCoordinateSpec = (year: number, value: number, text: string): ILineChartSpec =>
  ({
    type: 'line',
    data: [
      {
        id: 'data',
        values: [
          { year: 1950, value: 1 },
          { year: 1990, value: 2 }
        ]
      }
    ],
    xField: 'year',
    yField: 'value',
    axes: [
      {
        orient: 'bottom',
        type: 'linear'
      },
      {
        orient: 'left',
        type: 'linear'
      }
    ],
    markPoint: [
      {
        coordinate: {
          year,
          value
        },
        regionRelative: true,
        itemLine: {
          visible: true,
          line: {
            style: {
              stroke: '#F0A868'
            }
          }
        },
        itemContent: {
          offsetY: -24,
          offsetX: -24,
          confine: true,
          text: {
            text
          },
          style: {
            visible: true,
            textAlign: 'right',
            textBaseline: 'middle',
            fill: '#F0A868',
            fontSize: 12
          }
        }
      }
    ]
  } as unknown as ILineChartSpec);

const createMarkLineCoordinatesSpec = (startYear: number, endYear: number): ILineChartSpec =>
  ({
    ...createMarkPointCoordinateSpec(1950, 1, 'point'),
    markPoint: undefined,
    markLine: [
      {
        coordinates: [
          { year: startYear, value: 1 },
          { year: endYear, value: 2 }
        ],
        line: {
          style: {
            stroke: '#F0A868'
          }
        }
      }
    ]
  } as unknown as ILineChartSpec);

const createMarkAreaCoordinatesSpec = (startYear: number, endYear: number): ILineChartSpec =>
  ({
    ...createMarkPointCoordinateSpec(1950, 1, 'point'),
    markPoint: undefined,
    markArea: [
      {
        coordinates: [
          { year: startYear, value: 1 },
          { year: endYear, value: 1 },
          { year: endYear, value: 2 },
          { year: startYear, value: 2 }
        ],
        area: {
          style: {
            fill: 'rgba(240, 168, 104, 0.2)'
          }
        }
      }
    ]
  } as unknown as ILineChartSpec);

const createMarkPointXYSpec = (year: number, value: number): ILineChartSpec =>
  ({
    ...createMarkPointCoordinateSpec(1950, 1, 'point'),
    markPoint: [
      {
        x: year,
        y: value,
        itemContent: {
          text: {
            text: 'xy'
          }
        }
      }
    ]
  } as unknown as ILineChartSpec);

const createMarkPointPositionSpec = (x: number, y: number): ILineChartSpec =>
  ({
    ...createMarkPointCoordinateSpec(1950, 1, 'point'),
    markPoint: [
      {
        position: { x, y },
        regionRelative: true,
        itemContent: {
          text: {
            text: 'position'
          }
        }
      }
    ]
  } as unknown as ILineChartSpec);

const createMarkPointCoordinatesOffsetSpec = (offsetX: number, offsetY: number): ILineChartSpec =>
  ({
    ...createMarkPointCoordinateSpec(1950, 1, 'point'),
    markPoint: [
      {
        coordinate: {
          year: 1950,
          value: 1
        },
        coordinatesOffset: {
          x: offsetX,
          y: offsetY
        },
        itemContent: {
          text: {
            text: 'offset'
          }
        }
      }
    ]
  } as unknown as ILineChartSpec);

const createAutoRangeMarkPointCoordinateSpec = (year: number, value: number): ILineChartSpec => {
  const spec = createMarkPointCoordinateSpec(year, value, 'autoRange') as any;
  spec.markPoint[0].autoRange = true;
  return spec;
};

const createMarkLineXYSpec = (
  startYear: number,
  startValue: number,
  endYear: number,
  endValue: number
): ILineChartSpec =>
  ({
    ...createMarkPointCoordinateSpec(1950, 1, 'point'),
    markPoint: undefined,
    markLine: [
      {
        x: startYear,
        y: startValue,
        x1: endYear,
        y1: endValue,
        line: {
          style: {
            stroke: '#F0A868'
          }
        }
      }
    ]
  } as unknown as ILineChartSpec);

const createMarkLinePositionsSpec = (startX: number, endX: number): ILineChartSpec =>
  ({
    ...createMarkPointCoordinateSpec(1950, 1, 'point'),
    markPoint: undefined,
    markLine: [
      {
        positions: [
          { x: startX, y: 10 },
          { x: endX, y: 30 }
        ],
        regionRelative: true,
        line: {
          style: {
            stroke: '#F0A868'
          }
        }
      }
    ]
  } as unknown as ILineChartSpec);

const createMarkAreaXYSpec = (
  startYear: number,
  endYear: number,
  startValue: number,
  endValue: number
): ILineChartSpec =>
  ({
    ...createMarkPointCoordinateSpec(1950, 1, 'point'),
    markPoint: undefined,
    markArea: [
      {
        x: startYear,
        x1: endYear,
        y: startValue,
        y1: endValue,
        area: {
          style: {
            fill: 'rgba(240, 168, 104, 0.2)'
          }
        }
      }
    ]
  } as unknown as ILineChartSpec);

const createBrushStyleSpec = (fill: string, outOfBrushOpacity: number): IBarChartSpec =>
  ({
    ...createSpec(),
    brush: {
      visible: true,
      brushType: 'rect',
      style: {
        fill
      },
      inBrush: {
        colorAlpha: 1
      },
      outOfBrush: {
        colorAlpha: outOfBrushOpacity
      }
    }
  } as unknown as IBarChartSpec);

const createCustomMarkStyleSpec = (fill: string): IBarChartSpec =>
  ({
    ...createSpec(),
    customMark: [
      {
        type: 'text',
        name: 'customText',
        style: {
          x: 20,
          y: 20,
          text: 'custom',
          fill
        }
      }
    ]
  } as unknown as IBarChartSpec);

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

  it('classifies top-level bar state filter updates as series compile-only', () => {
    const beforeFilter = () => true;
    const afterFilter = () => false;

    expectSeriesCompileOnlySpecUpdate(
      dom,
      () => createTopLevelBarStateFilterSpec(beforeFilter),
      () => createTopLevelBarStateFilterSpec(afterFilter),
      chart => {
        const barMark = (chart.getChart() as any)
          .getAllSeries()[0]
          .getMarks()
          .find((mark: any) => mark.name === 'bar') as any;
        expect(barMark?.stateStyle?.custom?.fillOpacity?.style).toBe(0.4);
        expect(barMark?.state?.getStateInfo('custom')?.filter).toBe(afterFilter);
      }
    );
  });

  it('classifies top-level line mark style updates as series compile-only', () => {
    expectSeriesCompileOnlySpecUpdate(
      dom,
      () => createTopLevelLineMarkStyleSpec('#000'),
      () => createTopLevelLineMarkStyleSpec('#f00'),
      chart => {
        const lineMark = (chart.getChart() as any)
          .getAllSeries()[0]
          .getMarks()
          .find((mark: any) => mark.name === 'line') as any;
        expect(lineMark?.stateStyle?.normal?.stroke?.style).toBe('#f00');
      }
    );
  });

  it('keeps top-level mark id updates on the structural remake path', () => {
    const chart = new VChart(createTopLevelLineMarkIdSpec('before'), { dom, animation: false });

    try {
      chart.renderSync();

      const result = (chart as unknown as VChartInternals)._updateSpec(createTopLevelLineMarkIdSpec('after'), false);

      expect(result.reMake).toBe(true);
    } finally {
      chart.release();
    }
  });

  it('classifies top-level pie state filter updates as series compile-only', () => {
    const beforeFilter = () => true;
    const afterFilter = () => false;

    expectSeriesCompileOnlySpecUpdate(
      dom,
      () => createTopLevelPieStateFilterSpec(beforeFilter),
      () => createTopLevelPieStateFilterSpec(afterFilter),
      chart => {
        const pieMark = (chart.getChart() as any)
          .getAllSeries()[0]
          .getMarks()
          .find((mark: any) => mark.name === 'pie') as any;
        expect(pieMark?.stateStyle?.custom?.outerRadius?.style).toBe(0.8);
        expect(pieMark?.state?.getStateInfo('custom')?.filter).toBe(afterFilter);
      }
    );
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

  it('classifies dataZoom startText formatMethod updates as component-only', () => {
    expectComponentOnlySpecUpdate(
      dom,
      () => createDataZoomTextSpec(text => `${text}`),
      () => createDataZoomTextSpec(text => `value:${text}`),
      { layout: true }
    );
  });

  it('classifies scrollBar slider style updates as component-only', () => {
    expectComponentOnlySpecUpdate(dom, () => createScrollBarStyleSpec('#333'), () => createScrollBarStyleSpec('#666'), {
      layout: true
    });
  });

  it('classifies tooltip style updates as component-only', () => {
    expectComponentOnlySpecUpdate(dom, () => createTooltipStyleSpec('#333'), () => createTooltipStyleSpec('#666'));
  });

  it('classifies player appearance updates as component-only', () => {
    expectComponentOnlySpecUpdate(dom, () => createPlayerStyleSpec('#333'), () => createPlayerStyleSpec('#666'), {
      layout: true
    });
  });

  it('classifies indicator text updates as component-only', () => {
    expectComponentOnlySpecUpdate(
      dom,
      () => createIndicatorTextSpec('before'),
      () => createIndicatorTextSpec('after'),
      { layout: true }
    );
  });

  it('classifies marker label formatMethod updates as component-only', () => {
    expectComponentOnlySpecUpdate(
      dom,
      () => createMarkerLabelFormatSpec(() => 'before'),
      () => createMarkerLabelFormatSpec(() => 'after'),
      {
        layout: true,
        afterUpdate: chart => {
          const marker = getChartModel(chart).getComponentsByKey('markLine')[0] as any;
          expect(marker?._markerComponent?.attribute?.label?.[0]?.text).toBe('after');
        }
      }
    );
  });

  it('classifies markPoint coordinate and text updates as component-only', () => {
    const createInitialSpec = () => createMarkPointCoordinateSpec(1950, 1, 'before');
    const createNextSpec = () => createMarkPointCoordinateSpec(1990, 2, 'after');

    expectComponentOnlySpecUpdate(dom, createInitialSpec, createNextSpec, {
      layout: true,
      beforeUpdate: chart => {
        const marker = getChartModel(chart).getComponentsByKey('markPoint')[0] as any;
        return {
          position: { ...marker?._markerComponent?.attribute?.position },
          markerData: marker?.getMarkerData()
        };
      },
      afterUpdate: (chart, ctx) => {
        const { position, markerData } = ctx as { position: { x: number; y: number }; markerData: any };
        const marker = getChartModel(chart).getComponentsByKey('markPoint')[0] as any;
        expect(marker.getMarkerData()).not.toBe(markerData);
        expect(Object.values(markerData.dataSet.dataViewMap)).not.toContain(markerData);
        expect(marker?._markerComponent?.attribute?.position).not.toEqual(position);
        expect(marker?._markerComponent?.attribute?.itemContent?.textStyle?.text).toBe('after');
      }
    });
  });

  it('classifies markLine coordinates updates as component-only', () => {
    expectComponentOnlySpecUpdate(
      dom,
      () => createMarkLineCoordinatesSpec(1950, 1990),
      () => createMarkLineCoordinatesSpec(1990, 1950),
      {
        layout: true,
        beforeUpdate: chart => {
          const marker = getChartModel(chart).getComponentsByKey('markLine')[0] as any;
          return { points: marker?._markerComponent?.attribute?.points };
        },
        afterUpdate: (chart, ctx) => {
          const marker = getChartModel(chart).getComponentsByKey('markLine')[0] as any;
          expect(marker?._markerComponent?.attribute?.points).not.toEqual((ctx as { points: unknown }).points);
        }
      }
    );
  });

  it('classifies markArea coordinates updates as component-only', () => {
    expectComponentOnlySpecUpdate(
      dom,
      () => createMarkAreaCoordinatesSpec(1950, 1990),
      () => createMarkAreaCoordinatesSpec(1990, 1950),
      {
        layout: true,
        beforeUpdate: chart => {
          const marker = getChartModel(chart).getComponentsByKey('markArea')[0] as any;
          return { points: marker?._markerComponent?.attribute?.points };
        },
        afterUpdate: (chart, ctx) => {
          const marker = getChartModel(chart).getComponentsByKey('markArea')[0] as any;
          expect(marker?._markerComponent?.attribute?.points).not.toEqual((ctx as { points: unknown }).points);
        }
      }
    );
  });

  it('classifies markPoint x y updates as component-only', () => {
    expectComponentOnlySpecUpdate(dom, () => createMarkPointXYSpec(1950, 1), () => createMarkPointXYSpec(1990, 2), {
      layout: true,
      beforeUpdate: chart => {
        const marker = getChartModel(chart).getComponentsByKey('markPoint')[0] as any;
        return { position: { ...marker?._markerComponent?.attribute?.position } };
      },
      afterUpdate: (chart, ctx) => {
        const marker = getChartModel(chart).getComponentsByKey('markPoint')[0] as any;
        expect(marker?._markerComponent?.attribute?.position).not.toEqual(
          (ctx as { position: { x: number; y: number } }).position
        );
      }
    });
  });

  it('classifies markPoint position updates as component-only', () => {
    expectComponentOnlySpecUpdate(
      dom,
      () => createMarkPointPositionSpec(10, 10),
      () => createMarkPointPositionSpec(30, 40),
      {
        layout: true,
        beforeUpdate: chart => {
          const marker = getChartModel(chart).getComponentsByKey('markPoint')[0] as any;
          return { position: { ...marker?._markerComponent?.attribute?.position } };
        },
        afterUpdate: (chart, ctx) => {
          const marker = getChartModel(chart).getComponentsByKey('markPoint')[0] as any;
          expect(marker?._markerComponent?.attribute?.position).not.toEqual(
            (ctx as { position: { x: number; y: number } }).position
          );
        }
      }
    );
  });

  it('classifies markPoint coordinatesOffset updates as component-only', () => {
    expectComponentOnlySpecUpdate(
      dom,
      () => createMarkPointCoordinatesOffsetSpec(0, 0),
      () => createMarkPointCoordinatesOffsetSpec(12, 8),
      {
        layout: true,
        beforeUpdate: chart => {
          const marker = getChartModel(chart).getComponentsByKey('markPoint')[0] as any;
          return { position: { ...marker?._markerComponent?.attribute?.position } };
        },
        afterUpdate: (chart, ctx) => {
          const marker = getChartModel(chart).getComponentsByKey('markPoint')[0] as any;
          expect(marker?._markerComponent?.attribute?.position).not.toEqual(
            (ctx as { position: { x: number; y: number } }).position
          );
        }
      }
    );
  });

  it('updates autoRange marker coordinate domain without remake', () => {
    const classifyChart = new VChart(createAutoRangeMarkPointCoordinateSpec(2200, 3), { dom, animation: false });

    try {
      classifyChart.renderSync();

      const result = (classifyChart as unknown as VChartInternals)._updateSpec(
        createAutoRangeMarkPointCoordinateSpec(1960, 1.5),
        false
      );

      expect(result.reMake).toBe(false);
      expect(result.effects).toMatchObject({
        component: true,
        scaleDomain: true,
        layout: true,
        render: true
      });
    } finally {
      classifyChart.release();
    }

    const updateChart = new VChart(createAutoRangeMarkPointCoordinateSpec(2200, 3), { dom, animation: false });

    try {
      updateChart.renderSync();
      const chartModel = getChartModel(updateChart);
      const xAxis = chartModel.getComponentsByKey('axes')[0] as any;
      const spies = spyOnDataStages(updateChart);
      const seriesReInit = spyOnFirstSeriesReInit(chartModel);

      expect(xAxis.getScale().domain()[1]).toBeGreaterThanOrEqual(2200);

      updateChart.updateSpecSync(createAutoRangeMarkPointCoordinateSpec(1960, 1.5));

      expect(seriesReInit).not.toHaveBeenCalled();
      expectDataStagesSkipped(spies);
      expect(xAxis.getScale().domain()[1]).toBeLessThan(2200);
    } finally {
      updateChart.release();
    }
  });

  it('classifies markLine x y x1 y1 updates as component-only', () => {
    expectComponentOnlySpecUpdate(
      dom,
      () => createMarkLineXYSpec(1950, 1, 1990, 2),
      () => createMarkLineXYSpec(1950, 2, 1990, 1),
      {
        layout: true,
        beforeUpdate: chart => {
          const marker = getChartModel(chart).getComponentsByKey('markLine')[0] as any;
          return { points: marker?._markerComponent?.attribute?.points?.map((point: any) => ({ ...point })) };
        },
        afterUpdate: (chart, ctx) => {
          const marker = getChartModel(chart).getComponentsByKey('markLine')[0] as any;
          expect(marker?._markerComponent?.attribute?.points).not.toEqual((ctx as { points: unknown }).points);
        }
      }
    );
  });

  it('classifies markLine positions updates as component-only', () => {
    expectComponentOnlySpecUpdate(
      dom,
      () => createMarkLinePositionsSpec(10, 30),
      () => createMarkLinePositionsSpec(20, 40),
      {
        layout: true,
        beforeUpdate: chart => {
          const marker = getChartModel(chart).getComponentsByKey('markLine')[0] as any;
          return { points: marker?._markerComponent?.attribute?.points?.map((point: any) => ({ ...point })) };
        },
        afterUpdate: (chart, ctx) => {
          const marker = getChartModel(chart).getComponentsByKey('markLine')[0] as any;
          expect(marker?._markerComponent?.attribute?.points).not.toEqual((ctx as { points: unknown }).points);
        }
      }
    );
  });

  it('classifies markArea x y x1 y1 updates as component-only', () => {
    expectComponentOnlySpecUpdate(
      dom,
      () => createMarkAreaXYSpec(1950, 1990, 1, 2),
      () => createMarkAreaXYSpec(1960, 1980, 1.2, 1.8),
      {
        layout: true,
        beforeUpdate: chart => {
          const marker = getChartModel(chart).getComponentsByKey('markArea')[0] as any;
          return { points: marker?._markerComponent?.attribute?.points?.map((point: any) => ({ ...point })) };
        },
        afterUpdate: (chart, ctx) => {
          const marker = getChartModel(chart).getComponentsByKey('markArea')[0] as any;
          expect(marker?._markerComponent?.attribute?.points).not.toEqual((ctx as { points: unknown }).points);
        }
      }
    );
  });

  it('classifies brush appearance updates as component-only', () => {
    expectComponentOnlySpecUpdate(
      dom,
      () => createBrushStyleSpec('#333', 0.2),
      () => createBrushStyleSpec('#666', 0.4),
      {
        layout: true,
        afterUpdate: chart => {
          const barMark = (getChartModel(chart).getAllSeries()[0] as any)
            .getMarks()
            .find((mark: any) => mark.name === 'bar') as any;
          expect(barMark?.stateStyle?.outOfBrush?.fillOpacity?.style).toBe(0.4);
        }
      }
    );
  });

  it('classifies customMark style updates as component-only', () => {
    expectComponentOnlySpecUpdate(
      dom,
      () => createCustomMarkStyleSpec('#333'),
      () => createCustomMarkStyleSpec('#666'),
      {
        afterUpdate: chart => {
          const customMark = (chart.getChart() as any).getAllMarks().find((mark: any) => mark.name === 'customText');
          expect(customMark?.getGraphics?.()[0]?.attribute?.fill).toBe('#666');
        }
      }
    );
  });

  it('skips chart dataflow for label updateModelSpec appearance-only updates', () => {
    const chart = new VChart(createTopLevelLabelSpec('top'), { dom, animation: false });

    try {
      chart.renderSync();

      const label = getChartModel(chart).getComponentsByKey('label')[0] as unknown as TestModel;
      const chartModel = getChartModel(chart);
      const reDataFlow = jest.spyOn(chartModel, 'reDataFlow');

      (chart as unknown as VChartInternals)._updateModelSpec(label, createTopLevelLabelSpec('inside'), true);

      expect(reDataFlow).not.toHaveBeenCalled();
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
