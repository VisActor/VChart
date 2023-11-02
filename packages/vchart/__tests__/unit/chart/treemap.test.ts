import { GlobalScale } from '../../../src/scale/global-scale';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { EventDispatcher } from '../../../src/event/event-dispatcher';
import { default as VChart } from '../../../src';
import { DataSet, csvParser } from '@visactor/vdataset';
import { createCanvas, removeDom } from '../../util/dom';
import { getTestCompiler } from '../../util/factory/compiler';
import { disk } from '../../data/disk';
import type { ITreemapChartSpec } from '../../../src/chart/treemap';
// eslint-disable-next-line no-duplicate-imports
import { TreemapChart } from '../../../src/chart/treemap';
import type { TreemapSeries } from '../../../src/series/treemap/treemap';
import { DEFAULT_HIERARCHY_DEPTH } from '../../../src/constant/hierarchy';
import { initChartDataSet } from '../../util/context';

// 保证引入执行 Build-in
const dataSet = new DataSet();
initChartDataSet(dataSet);
dataSet.registerParser('csv', csvParser);

const spec: ITreemapChartSpec = {
  type: 'treemap',
  width: 500,
  height: 500,
  data: [
    {
      id: 'data',
      values: disk
    }
  ],
  aspectRatio: 0.7,
  categoryField: 'name',
  valueField: 'value',
  minVisibleArea: 300
};

describe('treemap chart test', () => {
  let canvasDom: HTMLCanvasElement;
  beforeEach(() => {
    canvasDom = createCanvas();
    canvasDom.style.position = 'relative';
    canvasDom.style.width = '500px';
    canvasDom.style.height = '500px';
    canvasDom.width = 500;
    canvasDom.height = 500;
  });

  afterEach(() => {
    removeDom(canvasDom);
  });

  test('wordCloud chart init', () => {
    const chart = new TreemapChart(spec, {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      eventDispatcher: new EventDispatcher({} as any, { addEventListener: () => {} } as any),
      globalInstance: {
        getContainer: () => ({}),
        getTooltipHandlerByUser: (() => undefined) as () => undefined
      },
      render: {} as any,
      dataSet,
      map: new Map(),
      container: null,
      mode: 'desktop-browser',
      getCompiler: getTestCompiler,
      globalScale: new GlobalScale([], { getAllSeries: () => [] as any[] } as any),
      onError: () => {}
    } as any);
    chart.created();
    chart.init();

    const series: TreemapSeries = chart.getAllSeries()[0] as TreemapSeries;
    expect(series.type).toEqual('treemap');

    // mark
    expect(series.getMarks().length).toEqual(3);
    expect(chart.getRegionsInIndex().length).toEqual(1);
    expect(series.getRegion().id).toEqual(chart.getRegionsInIndex()[0].id);
  });

  test('treemap compiler', async () => {
    const cs = new VChart(spec, {
      mode: 'desktop-browser',
      renderCanvas: canvasDom
    });
    await cs.renderAsync();
    const series: TreemapSeries = cs.getChart().getAllSeries()[0] as TreemapSeries;
    const leafMark = series.getMarkInName('leaf');
    const leafMarkProduct = leafMark?.getProduct();
    expect(leafMarkProduct?.elements.length).toBe(90); // 叶子图元
    expect(series.getRawDataStatisticsByField(DEFAULT_HIERARCHY_DEPTH, true).max).toBe(2);
    cs.release();
  });

  test('treemap maxDepth', async () => {
    const vchart = new VChart(
      {
        type: 'treemap',
        width: 500,
        height: 500,
        data: [
          {
            id: 'data',
            values: disk
          }
        ],
        label: { visible: true },
        nonLeaf: { visible: true },
        aspectRatio: 0.7,
        categoryField: 'name',
        valueField: 'value',
        minVisibleArea: 300,
        maxDepth: 2
      },
      {
        mode: 'desktop-browser',
        renderCanvas: canvasDom
      }
    );
    await vchart.renderAsync();
    const series: TreemapSeries = vchart.getChart().getAllSeries()[0] as TreemapSeries;
    const leafMark = series.getMarkInName('leaf');
    const nonLeafMark = series.getMarkInName('nonLeaf');
    const labelMark = series.getMarkInName('label');

    const leafProduct = leafMark?.getProduct();
    const labelProduct = labelMark?.getProduct();
    const nonLeafProduct = nonLeafMark?.getProduct();

    expect(leafProduct?.elements.length).toBe(86); // 叶子图元
    expect(labelProduct?.elements.length).toBe(86); // 叶子标签图元
    expect(nonLeafProduct?.elements.length).toBe(17); // 非叶子图元
  });
});
