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

  it('updates data that has no matchable id', async () => {
    const spec = {
      type: 'bar' as const,
      width: 400,
      height: 300,
      animation: false,
      xField: 'x',
      yField: 'y',
      data: [{ values: [{ x: 'A', y: 1 }] }]
    };

    await renderChart(
      <VChart ref={setChart} spec={spec} data={[{ values: [{ x: 'A', y: 10 }] }]} options={chartOptions} />
    );
    expect(readYValues(chart as ChartLike)).toEqual([10]);

    await renderChart(
      <VChart ref={setChart} spec={spec} data={[{ values: [{ x: 'A', y: 99 }] }]} options={chartOptions} />
    );
    expect(readYValues(chart as ChartLike)).toEqual([99]);
  });

  it('restores spec.data when the data override is removed', async () => {
    const spec = {
      type: 'bar' as const,
      width: 400,
      height: 300,
      animation: false,
      xField: 'x',
      yField: 'y',
      data: [{ id: 'id0', values: [{ x: 'A', y: 1 }] }]
    };
    const override = [{ id: 'id0', values: [{ x: 'A', y: 10 }] }];

    await renderChart(<VChart ref={setChart} spec={spec} data={override} options={chartOptions} />);
    expect(readYValues(chart as ChartLike)).toEqual([10]);

    await renderChart(<VChart ref={setChart} spec={spec} options={chartOptions} />);
    expect(readYValues(chart as ChartLike)).toEqual([1]);

    act(() => {
      unmountComponentAtNode(container);
    });
    chart = null;
    await renderChart(<VChart ref={setChart} spec={spec} options={chartOptions} />);
    expect(readYValues(chart as ChartLike)).toEqual([1]);
  });

  it('still updates data when every dataset id already exists', async () => {
    const spec = {
      type: 'bar' as const,
      width: 400,
      height: 300,
      animation: false,
      xField: 'x',
      yField: 'y',
      data: [{ id: 'id0', values: [{ x: 'A', y: 1 }] }]
    };

    await renderChart(
      <VChart ref={setChart} spec={spec} data={[{ id: 'id0', values: [{ x: 'A', y: 10 }] }]} options={chartOptions} />
    );
    expect(readYValues(chart as ChartLike)).toEqual([10]);

    await renderChart(
      <VChart ref={setChart} spec={spec} data={[{ id: 'id0', values: [{ x: 'A', y: 99 }] }]} options={chartOptions} />
    );
    expect(readYValues(chart as ChartLike)).toEqual([99]);
  });
});
