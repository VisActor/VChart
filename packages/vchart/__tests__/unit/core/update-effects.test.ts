import VChart, { type IBarChartSpec } from '../../../src';
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
