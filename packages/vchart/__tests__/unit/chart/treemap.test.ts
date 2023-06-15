import { GlobalScale } from '../../../src/scale/global-scale';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { EventDispatcher } from '../../../src/event/event-dispatcher';
import { ThemeManager, default as VChart } from '../../../src';
import { DataSet, csvParser, dataViewParser } from '@visactor/vdataset';
import { createCanvas, removeDom } from '../../util/dom';
import { getTestCompiler } from '../../util/factory/compiler';
import { disk } from '../../data/disk';
import type { ITreemapChartSpec } from '../../../src/chart/treemap';
// eslint-disable-next-line no-duplicate-imports
import { TreeMapChart } from '../../../src/chart/treemap';
import type { TreeMapSeries } from '../../../src/series/treemap/treemap';
import { DEFAULT_HIERARCHY_DEPTH } from '../../../src/constant/hierarchy';

// 保证引入执行 Build-in
const dataSet = new DataSet();
dataSet.registerParser('csv', csvParser);
dataSet.registerParser('dataview', dataViewParser);

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
    const chart = new TreeMapChart(spec, {
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
      getTheme: () => ThemeManager.getCurrentTheme()
    } as any);
    chart.created();
    chart.init();

    const series: TreeMapSeries = chart.getAllSeries()[0] as TreeMapSeries;
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
    const series: TreeMapSeries = cs.getChart().getAllSeries()[0] as TreeMapSeries;
    const leafMark = series.getMarkInName('leaf');
    const leafMarkProduct = leafMark?.getProduct();
    expect(leafMarkProduct?.elements.length).toBe(95); // 叶子图元
    expect(series.getRawDataStatistics()?.latestData?.[DEFAULT_HIERARCHY_DEPTH].max).toBe(2);
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
    const series: TreeMapSeries = vchart.getChart().getAllSeries()[0] as TreeMapSeries;
    const leafMark = series.getMarkInName('leaf');
    const nonLeafMark = series.getMarkInName('nonLeaf');
    const labelMark = series.getMarkInName('label');

    const leafProduct = leafMark?.getProduct();
    const labelProduct = labelMark?.getProduct();
    const nonLeafProduct = nonLeafMark?.getProduct();

    expect(leafProduct?.elements.length).toBe(91); // 叶子图元
    expect(labelProduct?.elements.length).toBe(91); // 叶子标签图元
    expect(nonLeafProduct?.elements.length).toBe(17); // 非叶子图元
  });
});
