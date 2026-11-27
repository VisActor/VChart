import VChart, { type IBarChartSpec } from '../../../../src';
import type { DataZoom } from '../../../../src/component/data-zoom/data-zoom/data-zoom';
import type { IGroup, ILine } from '@visactor/vrender-core';
import { createDiv, removeDom } from '../../../util/dom';

type Row = { category: string; series: string; value: number };
const rows: Row[] = [
  { category: 'A', series: 'S', value: 10 },
  { category: 'B', series: 'S', value: 30 },
  { category: 'C', series: 'S', value: 20 }
];
const makeSpec = (values: Row[]): IBarChartSpec => ({
  type: 'bar',
  width: 500,
  height: 500,
  animation: false,
  xField: ['category'],
  yField: 'value',
  seriesField: 'series',
  data: [{ id: 'data', values }],
  dataZoom: [{ orient: 'bottom' }]
});

describe('DataZoom preview validity', () => {
  let dom: HTMLElement;
  let chart: VChart;
  beforeEach(() => {
    dom = createDiv();
  });
  afterEach(() => {
    chart?.release();
    removeDom(dom);
  });

  const zoom = (orient: 'bottom' | 'left') =>
    chart
      .getChart()
      .getAllComponents()
      .find(c => c.type === 'dataZoom' && c.getSpec().orient === orient) as DataZoom;
  const graphic = (orient: 'bottom' | 'left', name: string) =>
    (zoom(orient).getVRenderComponents()[0] as IGroup).find(n => n.name === name, true);
  const expectHidden = (orient: 'bottom' | 'left') => {
    for (const name of ['previewLine', 'previewArea']) {
      const node = graphic(orient, name);
      expect(!node || node.attribute.visible === false).toBe(true);
    }
  };
  const expectPreview = () => {
    const line = graphic('bottom', 'previewLine') as ILine;
    expect(line).toBeTruthy();
    expect(line.attribute.visible).not.toBe(false);
    expect(line.attribute.points.length).toBeGreaterThan(2);
    expect(line.attribute.points.every(p => Number.isFinite(p.x) && Number.isFinite(p.y))).toBe(true);
  };

  it('hides the degenerate vertical preview and keeps the horizontal preview', () => {
    const spec = makeSpec(rows);
    spec.dataZoom = [{ orient: 'bottom' }, { orient: 'left' }];
    chart = new VChart(spec, { dom, animation: false });
    chart.renderSync();
    expectHidden('left');
    expectPreview();
  });

  it.each(['spec', 'data'] as const)('restores preview after a single-row %s update', mode => {
    chart = new VChart(makeSpec([{ category: 'A', series: 'S', value: 333 }]), { dom, animation: false });
    chart.renderSync();
    expectHidden('bottom');
    if (mode === 'spec') {
      chart.updateSpecSync(makeSpec(rows));
    } else {
      chart.updateDataSync('data', rows);
    }
    expectPreview();
    const model = zoom('bottom');
    const viewData = () => chart.getChart().getAllSeries()[0].getViewData().latestData;
    model.setStartAndEnd(0, 0.4);
    expect(viewData().length).toBeLessThan(rows.length);
    model.setStartAndEnd(0.4, 1);
    model.setStartAndEnd(0, 1);
    expect(viewData().map((d: Row) => d.category)).toEqual(['A', 'B', 'C']);
    expectPreview();
  });

  it('reapplies an unchanged filter window when data arrives or changes', () => {
    const times = ['2:00', '4:00', '6:00', '8:00', '10:00', '12:00', '14:00', '16:00', '18:00'];
    const values = [8, 9, 11, 14, 16, 17, 17, 16, 15];
    const incoming = times.map((time, index) => ({ time, value: values[index] }));
    chart = new VChart(
      {
        type: 'line',
        animation: false,
        data: { id: 'data0', values: [] },
        xField: 'time',
        yField: 'value',
        dataZoom: [{ orient: 'bottom', start: 0, end: 0.4 }]
      },
      { dom, animation: false }
    );
    chart.renderSync();
    const series = chart.getChart().getAllSeries()[0];
    const viewRows = () =>
      series.getViewData().latestData.map(({ time, value }: typeof incoming[number]) => ({ time, value }));
    const previewPoints = () => (graphic('bottom', 'previewLine') as ILine).attribute.points.map(({ x, y }) => [x, y]);
    const onZoom = jest.fn();
    chart.on('dataZoomChange', onZoom);
    expect(viewRows()).toEqual([]);

    chart.updateDataSync('data0', incoming);
    expect(viewRows()).toEqual(incoming.slice(0, 4));
    expect(zoom('bottom').stateScale.domain()).toEqual(times);
    expectPreview();

    chart.updateDataSync('data0', []);
    expect(viewRows()).toEqual([]);
    const replacement = incoming.map(({ time, value }) => ({ time: 'new-' + time, value: value + 2 }));
    chart.updateDataSync('data0', replacement);
    expect(viewRows()).toEqual(replacement.slice(0, 4));
    expect(zoom('bottom').stateScale.domain()).toEqual(replacement.map(row => row.time));
    expectPreview();

    const before = previewPoints();
    const revised = replacement.map((row, index) => ({ ...row, value: index === 1 ? row.value + 7 : row.value }));
    chart.updateDataSync('data0', revised);
    expect(viewRows()).toEqual(revised.slice(0, 4));
    expect(previewPoints()).not.toEqual(before);
    expect(onZoom).not.toHaveBeenCalled();
  });

  it.each([
    ['string', ['A', 'B', 'C', 'D']],
    ['numeric', [10, 20, 30, 40]]
  ])('preserves an explicit %s category domain across data updates', (_name, domain) => {
    const categories = domain as (string | number)[];
    const createRows = (order: number[], offset: number) =>
      order.map((index, i) => ({ category: categories[index], value: i + offset }));
    chart = new VChart(
      {
        type: 'bar',
        animation: false,
        xField: 'category',
        yField: 'value',
        data: { id: 'data', values: createRows([1, 0, 2, 3], 1) },
        axes: [
          { id: 'x-axis', orient: 'bottom', type: 'band', domain: categories },
          { orient: 'left', type: 'linear' }
        ],
        dataZoom: [{ axisId: 'x-axis', orient: 'bottom', start: 0, end: 0.1 }]
      },
      { dom, animation: false }
    );
    chart.renderSync();
    const model = zoom('bottom');
    const series = chart.getChart().getAllSeries()[0];
    const viewRows = () => series.getViewData().latestData.map(({ category, value }: Row) => ({ category, value }));
    expect(model.stateScale.domain()).toEqual(categories);
    expect(viewRows()).toEqual([{ category: categories[0], value: 2 }]);

    // 仅更新数值，窗口仍对应显式域的首个分类。
    chart.updateDataSync('data', createRows([1, 0, 2, 3], 5));
    expect(model.stateScale.domain()).toEqual(categories);
    expect(viewRows()).toEqual([{ category: categories[0], value: 6 }]);

    // 缺失分类和空数据均不能压缩显式域。
    chart.updateDataSync('data', createRows([3, 1], 10));
    expect(model.stateScale.domain()).toEqual(categories);
    expect(viewRows()).toEqual([]);
    chart.updateDataSync('data', []);
    expect(model.stateScale.domain()).toEqual(categories);
    expect(viewRows()).toEqual([]);
    chart.updateDataSync('data', createRows([3, 2, 1, 0], 20));
    expect(model.stateScale.domain()).toEqual(categories);
    expect(viewRows()).toEqual([{ category: categories[0], value: 23 }]);
    expectPreview();

    model.setStartAndEnd(0.9, 1);
    expect(viewRows()).toEqual([{ category: categories[3], value: 20 }]);
  });

  it.each([
    ['an omitted axis domain', undefined, undefined, ['B', 'A', 'C', 'D']],
    ['an empty axis domain', [], undefined, ['B', 'A', 'C', 'D']],
    ['a custom DataZoom domain', ['A', 'B', 'C', 'D'], ['C', 'B', 'A', 'D'], ['C', 'B', 'A', 'D']]
  ])('respects %s when updating data', (_name, domain, customDomain, expected) => {
    const createRows = (offset: number) =>
      ['B', 'A', 'C', 'D'].map((category, index) => ({ category, value: index + offset }));
    chart = new VChart(
      {
        type: 'bar',
        animation: false,
        xField: 'category',
        yField: 'value',
        data: { id: 'data', values: createRows(1) },
        axes: [
          { id: 'x-axis', orient: 'bottom', type: 'band', domain },
          { orient: 'left', type: 'linear' }
        ],
        dataZoom: [{ axisId: 'x-axis', orient: 'bottom', start: 0, end: 0.1, customDomain }]
      } as IBarChartSpec,
      { dom, animation: false }
    );
    chart.renderSync();
    const updated = createRows(5);
    chart.updateDataSync('data', updated);
    expect(zoom('bottom').stateScale.domain()).toEqual(expected);
    expect(
      chart
        .getChart()
        .getAllSeries()[0]
        .getViewData()
        .latestData.map(({ category, value }: Row) => ({ category, value }))
    ).toEqual(updated.filter(row => row.category === expected[0]));
  });

  it.each([
    [
      'both bounds',
      {
        bounds: { min: 0, max: 100 },
        initial: [20, 40],
        updated: [20, 40],
        domain: [0, 100],
        retained: [20, 40]
      }
    ],
    [
      'only the upper bound',
      {
        bounds: { max: 100 },
        initial: [20, 40, 80],
        updated: [10, 50, 60, 120],
        domain: [10, 100],
        retained: [10, 50]
      }
    ]
  ] as const)(
    'preserves %s of the bound axis when updating the filter window',
    (_name, { bounds, initial, updated, domain, retained }) => {
      const createRows = (values: readonly number[], offset: number) =>
        values.map((x, index) => ({ x, y: index + offset }));
      chart = new VChart(
        {
          type: 'scatter',
          animation: false,
          data: { id: 'data', values: createRows(initial, 1) },
          xField: 'x',
          yField: 'y',
          axes: [
            { id: 'x-axis', orient: 'bottom', type: 'linear', zero: false, nice: false, ...bounds },
            { orient: 'left', type: 'linear' }
          ],
          dataZoom: [{ axisId: 'x-axis', orient: 'bottom', start: 0, end: 0.5 }]
        },
        { dom, animation: false }
      );
      chart.renderSync();
      const series = chart.getChart().getAllSeries()[0];

      chart.updateDataSync('data', createRows(updated, 3));

      expect(series.getViewData().latestData.map((row: { x: number }) => row.x)).toEqual(retained);
      expect(zoom('bottom').stateScale.domain()).toEqual(domain);
    }
  );

  it.each([
    ['includes zero by default', { nice: false }, [10, 20, 40], [0, 40], [20, 40]],
    ['allows zero to be excluded', { nice: false, zero: false }, [10, 20, 40], [10, 40], [40]],
    ['rounds automatic bounds', {}, [10, 25, 31, 41], [0, 50], [25, 31, 41]],
    [
      'applies soft bounds and expansion',
      { nice: false, zero: false, softMin: 0, expand: { max: 0.5 } },
      [10, 20, 30, 40],
      [0, 60],
      [30, 40]
    ]
  ] as const)('%s in the DataZoom domain after updating data', (_name, axis, values, domain, retained) => {
    const createRows = (offset: number) => values.map((x, index) => ({ x, y: index + offset }));
    chart = new VChart(
      {
        type: 'scatter',
        animation: false,
        data: { id: 'data', values: createRows(1) },
        xField: 'x',
        yField: 'y',
        axes: [
          { id: 'x-axis', orient: 'bottom', type: 'linear', ...axis },
          { orient: 'left', type: 'linear' }
        ],
        dataZoom: [{ axisId: 'x-axis', orient: 'bottom', start: 0.5, end: 1 }]
      },
      { dom, animation: false }
    );
    chart.renderSync();
    const series = chart.getChart().getAllSeries()[0];
    const retainedX = () => series.getViewData().latestData.map((row: { x: number }) => row.x);
    expect(retainedX()).toEqual(retained);

    chart.updateDataSync('data', createRows(5));

    expect(retainedX()).toEqual(retained);
    expect(zoom('bottom').stateScale.domain()).toEqual(domain);
  });

  it('uses a continuous filter window when an unbound field gains numeric statistics', () => {
    const incoming = [
      { x: 0, y: 1 },
      { x: 50, y: 3 },
      { x: 100, y: 2 },
      { x: 1000, y: 4 }
    ];
    chart = new VChart(
      {
        type: 'scatter',
        animation: false,
        data: { id: 'data', values: [], fields: { x: { lockStatisticsByDomain: true, domain: [] } } },
        xField: 'x',
        yField: 'y',
        axes: [
          { orient: 'bottom', type: 'linear' },
          { orient: 'left', type: 'linear' }
        ],
        dataZoom: [{ orient: 'bottom', field: 'x', valueField: 'y', start: 0, end: 0.25 }]
      },
      { dom, animation: false }
    );
    chart.renderSync();
    const model = zoom('bottom');
    const series = chart.getChart().getAllSeries()[0];
    expect(model.stateScale.type).toBe('band');

    chart.updateFullDataSync({ id: 'data', values: incoming, fields: { x: { lockStatisticsByDomain: false } } });
    expect(model.stateScale.type).toBe('linear');
    expect(model.stateScale.domain()).toEqual([0, 1000]);
    expect(series.getViewData().latestData.map((row: { x: number }) => row.x)).toEqual([0, 50, 100]);
    expectPreview();
  });

  it.each(['batch', 'data view'] as const)('keeps an interactive filter window across a %s update', async mode => {
    chart = new VChart(makeSpec(rows), { dom, animation: false });
    chart.renderSync();
    const model = zoom('bottom');
    const series = chart.getChart().getAllSeries()[0];
    const visibleCategories = () => series.getViewData().latestData.map((row: Row) => row.category);
    model.setStartAndEnd(0, 0.4);
    expect(visibleCategories()).toEqual(['A', 'B']);
    const replacement = rows.map(row => ({ ...row, category: 'new-' + row.category }));

    if (mode === 'batch') {
      await chart.updateDataInBatches([{ id: 'data', data: replacement }]);
    } else {
      series.getRawData().parseNewData(replacement);
    }

    expect(visibleCategories()).toEqual(['new-A', 'new-B']);
    expect(model.stateScale.domain()).toEqual(['new-A', 'new-B', 'new-C']);
    expectPreview();
  });

  it('keeps numeric categories in axis order when the same field also has continuous statistics', () => {
    chart = new VChart(
      {
        type: 'bar',
        width: 500,
        height: 500,
        animation: false,
        xField: 'value',
        yField: 'value',
        data: { id: 'data', values: [{ value: 3 }, { value: 1 }, { value: 2 }] },
        axes: [
          { orient: 'bottom', type: 'band' },
          { orient: 'left', type: 'linear' }
        ],
        dataZoom: [{ orient: 'bottom', filterMode: 'axis' }]
      },
      { dom, animation: false }
    );
    chart.renderSync();
    const model = zoom('bottom');
    const previewValues = () =>
      model
        .getData()
        .getLatestData()
        .map((d: { x: number }) => d.x);
    expect(previewValues()).toEqual([3, 1, 2]);
    model.setStartAndEnd(0, 0.5);
    expect(model.stateScale.domain()).toEqual([3, 1, 2]);
    model.setStartAndEnd(0, 1);
    chart.updateDataSync('data', [{ value: 6 }, { value: 4 }, { value: 5 }]);
    expect(previewValues()).toEqual([6, 4, 5]);
    expect(model.stateScale.domain()).toEqual([6, 4, 5]);
  });

  it('does not collect discrete values for a continuous DataZoom axis on data updates', () => {
    chart = new VChart(
      {
        type: 'scatter',
        width: 500,
        height: 500,
        animation: false,
        xField: 'x',
        yField: 'y',
        data: { id: 'data', values: [{ x: 1, y: 1 }] },
        axes: [
          { orient: 'bottom', type: 'linear' },
          { orient: 'left', type: 'linear' }
        ],
        dataZoom: [{ orient: 'bottom' }]
      },
      { dom, animation: false }
    );
    chart.renderSync();
    const series = chart.getChart().getAllSeries()[0];
    const statistics = jest.spyOn(series, 'getRawDataStatisticsByField');
    chart.updateDataSync(
      'data',
      Array.from({ length: 10000 }, (_, x) => ({ x, y: x % 100 }))
    );
    const xCalls = statistics.mock.calls.filter(([field]) => String(field) === 'x');
    expect(xCalls.length).toBeGreaterThan(0);
    expect(xCalls.every(([, isNumeric]) => isNumeric === true)).toBe(true);
    expect(series.getRawDataStatisticsByField('x', true).values).toBeUndefined();
    expect(zoom('bottom').stateScale.domain()).toEqual([0, 10000]);
    statistics.mockRestore();
  });
});
