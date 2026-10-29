import React, { act, render, unmountComponentAtNode } from 'openinula';
import { createRequire } from 'module';
import path from 'path';
import { DataSet, DataView } from '@visactor/vchart';
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
  getSpec: () => {
    data?: Array<{ id?: string | number; name?: string | number }> | { id?: string | number; name?: string | number };
  };
  getDataSet: () => { getDataView: (id: string | number) => unknown };
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

const readDataIds = (chart: ChartLike) => {
  const data = chart.getSpec()?.data;
  const list = Array.isArray(data) ? data : data ? [data] : [];
  return list.map(item => item.id ?? item.name);
};

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

  it('re-parses the effective spec when the data list shrinks', async () => {
    const spec = {
      type: 'common' as const,
      width: 400,
      height: 300,
      animation: false,
      data: [
        { id: 'id0', values: [{ x: 'A', y: 1 }] },
        { id: 'id1', values: [{ x: 'B', y: 2 }] }
      ],
      series: [
        { type: 'bar', dataId: 'id0', xField: 'x', yField: 'y' },
        { type: 'bar', dataId: 'id1', xField: 'x', yField: 'y' }
      ]
    };
    const firstData = [
      { id: 'id0', values: [{ x: 'A', y: 10 }] },
      { id: 'id1', values: [{ x: 'B', y: 20 }] }
    ];
    const shrunkData = [{ id: 'id0', values: [{ x: 'A', y: 99 }] }];

    const first = await renderChart(<VChart ref={setChart} spec={spec} data={firstData} options={chartOptions} />);
    expect(readDataIds(first)).toEqual(['id0', 'id1']);
    expect(readYValues(first)).toEqual([10]);

    const updateFullDataSync = jest.spyOn(first, 'updateFullDataSync');
    const updateSpecSync = jest.spyOn(first, 'updateSpecSync');

    const second = await renderChart(<VChart ref={setChart} spec={spec} data={shrunkData} options={chartOptions} />);

    expect(second).toBe(first);
    expect(updateFullDataSync).not.toHaveBeenCalled();
    expect(updateSpecSync).toHaveBeenCalled();
    expect(readDataIds(second)).toEqual(['id0']);
    expect(readYValues(second)).toEqual([99]);
    expect(second.getDataSet().getDataView('id1')).toBeFalsy();

    act(() => {
      unmountComponentAtNode(container);
    });
    chart = null;
    const remounted = await renderChart(<VChart ref={setChart} spec={spec} data={shrunkData} options={chartOptions} />);
    expect(readDataIds(remounted)).toEqual(['id0']);
    expect(readYValues(remounted)).toEqual([99]);
  });

  it('rebinds a replacement DataView whose name matches an existing id', async () => {
    const spec = createBarSpec([{ id: 'id0', values: [{ x: 'A', y: 1 }] }]);

    const first = await renderChart(
      <VChart ref={setChart} spec={spec} data={[{ id: 'id0', values: [{ x: 'A', y: 10 }] }]} options={chartOptions} />
    );
    expect(readYValues(first)).toEqual([10]);

    const dataSet = new DataSet();
    const nextView = new DataView(dataSet, { name: 'id0' });
    nextView.parse([{ x: 'A', y: 99 }]);

    const updateFullDataSync = jest.spyOn(first, 'updateFullDataSync');
    const updateSpecSync = jest.spyOn(first, 'updateSpecSync');

    const second = await renderChart(<VChart ref={setChart} spec={spec} data={[nextView]} options={chartOptions} />);

    expect(second).toBe(first);
    expect(updateFullDataSync).not.toHaveBeenCalled();
    expect(updateSpecSync).toHaveBeenCalled();
    expect(readYValues(second)).toEqual([99]);
    expect(second.getChart().getAllSeries()[0].getRawData()).toBe(nextView);

    updateFullDataSync.mockClear();
    updateSpecSync.mockClear();

    const third = await renderChart(<VChart ref={setChart} spec={spec} data={[nextView]} options={chartOptions} />);

    expect(third).toBe(first);
    expect(updateFullDataSync).not.toHaveBeenCalled();
    expect(updateSpecSync).not.toHaveBeenCalled();
    expect(readYValues(third)).toEqual([99]);
    expect(third.getChart().getAllSeries()[0].getRawData()).toBe(nextView);
  });
});
