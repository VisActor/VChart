import VChart, { type IBarChartSpec } from '../../../src';
import type { IUpdateSpecResult } from '../../../src/model/interface';
import { createDiv, removeDom } from '../../util/dom';

type VChartInternals = {
  _renderSync: (option?: unknown) => unknown;
  _chart: unknown;
  _updateModelSpec: (model: TestModel, spec: unknown, sync?: boolean) => unknown;
};

type TestModel = {
  updateSpec: jest.Mock<IUpdateSpecResult, [unknown]>;
  reInit: jest.Mock<void, [unknown]>;
};

const createSpec = (): IBarChartSpec => ({
  type: 'bar',
  data: [{ id: 'data', values: [{ x: 'A', y: 1 }] }],
  xField: 'x',
  yField: 'y'
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
