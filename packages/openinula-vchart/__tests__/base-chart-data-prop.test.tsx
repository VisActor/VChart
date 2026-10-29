import React, { act, render, unmountComponentAtNode } from 'openinula';
import { createRequire } from 'module';
import path from 'path';
import { VChart } from '../src/VChart';

const requireFromVChart = createRequire(path.resolve(__dirname, '../../vchart/package.json'));
const Canvas = requireFromVChart('canvas');

const chartOptions = {
  mode: 'node' as const,
  modeParams: Canvas,
  animation: false
};

type Datum = { x: string; y: number };
type SeriesData = { latestData?: Datum[] };
type SeriesLike = { getRawData: () => SeriesData };
type ChartLike = {
  getChart: () => { getAllSeries: () => SeriesLike[] };
  release: () => void;
  updateFullDataSync: (...args: unknown[]) => unknown;
  updateSpecSync: (...args: unknown[]) => unknown;
};

const createBarSpec = (data: Array<{ id?: string; values: Datum[] }>) => ({
  type: 'bar' as const,
  width: 400,
  height: 300,
  animation: false,
  xField: 'x',
  yField: 'y',
  data
});

const readYValues = (chart: ChartLike) => {
  const series = chart.getChart().getAllSeries();
  const latestData = series[0]?.getRawData()?.latestData;
  if (!Array.isArray(latestData)) {
    throw new Error('bar series did not expose rendered data');
  }
  return latestData.map(datum => datum.y);
};

describe('openinula VChart data prop', () => {
  let container: HTMLDivElement;
  let chart: ChartLike | null;

  const setChart = (instance: ChartLike | null) => {
    if (instance) {
      chart = instance;
    }
  };

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    chart = null;
  });

  afterEach(() => {
    act(() => {
      unmountComponentAtNode(container);
    });
    container.remove();
    chart = null;
  });

  const renderChart = async (element: React.ReactElement) => {
    await act(() => {
      render(element, container);
    });
    if (!chart) {
      throw new Error('VChart did not finish its render/act lifecycle');
    }
    return chart;
  };

  it('updates data that already has a matching id via updateFullDataSync', async () => {
    const spec = createBarSpec([{ id: 'id0', values: [{ x: 'A', y: 1 }] }]);

    const first = await renderChart(
      <VChart ref={setChart} spec={spec} data={[{ id: 'id0', values: [{ x: 'A', y: 10 }] }]} options={chartOptions} />
    );
    expect(readYValues(first)).toEqual([10]);

    const updateFullDataSync = jest.spyOn(first, 'updateFullDataSync');
    const updateSpecSync = jest.spyOn(first, 'updateSpecSync');

    const second = await renderChart(
      <VChart ref={setChart} spec={spec} data={[{ id: 'id0', values: [{ x: 'A', y: 99 }] }]} options={chartOptions} />
    );

    expect(second).toBe(first);
    expect(updateFullDataSync).toHaveBeenCalled();
    expect(updateSpecSync).not.toHaveBeenCalled();
    expect(readYValues(second)).toEqual([99]);
  });

  it('re-parses the effective spec when data has no matchable id', async () => {
    const spec = createBarSpec([{ values: [{ x: 'A', y: 1 }] }]);

    const first = await renderChart(
      <VChart ref={setChart} spec={spec} data={[{ values: [{ x: 'A', y: 10 }] }]} options={chartOptions} />
    );
    expect(readYValues(first)).toEqual([10]);

    const updateFullDataSync = jest.spyOn(first, 'updateFullDataSync');
    const updateSpecSync = jest.spyOn(first, 'updateSpecSync');

    const second = await renderChart(
      <VChart ref={setChart} spec={spec} data={[{ values: [{ x: 'A', y: 99 }] }]} options={chartOptions} />
    );

    expect(second).toBe(first);
    expect(updateFullDataSync).not.toHaveBeenCalled();
    expect(updateSpecSync).toHaveBeenCalled();
    expect(readYValues(second)).toEqual([99]);
  });

  it('restores spec.data by re-parse when the optional data prop is removed', async () => {
    const spec = createBarSpec([{ id: 'id0', values: [{ x: 'A', y: 1 }] }]);
    const override = [{ id: 'id0', values: [{ x: 'A', y: 10 }] }];

    const first = await renderChart(<VChart ref={setChart} spec={spec} data={override} options={chartOptions} />);
    expect(readYValues(first)).toEqual([10]);

    const updateFullDataSync = jest.spyOn(first, 'updateFullDataSync');
    const updateSpecSync = jest.spyOn(first, 'updateSpecSync');

    const second = await renderChart(<VChart ref={setChart} spec={spec} options={chartOptions} />);

    expect(second).toBe(first);
    expect(updateFullDataSync).not.toHaveBeenCalled();
    expect(updateFullDataSync).not.toHaveBeenCalledWith(undefined);
    expect(updateSpecSync).toHaveBeenCalled();
    expect(readYValues(second)).toEqual([1]);

    act(() => {
      unmountComponentAtNode(container);
    });
    chart = null;
    const remounted = await renderChart(<VChart ref={setChart} spec={spec} options={chartOptions} />);
    expect(readYValues(remounted)).toEqual([1]);
  });
});
