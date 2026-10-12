import { Matrix } from '@visactor/vutils';
import { VChart } from '../../../src/vchart-all';
import type { IMapChartSpec } from '../../../src';
import type { MapSeries } from '../../../src/series/map/map';
import { createCanvas, removeDom } from '../../util/dom';

/**
 * Issue #4585: 地图开启 roam 后，缩放/平移时 label 应当跟随地图同步缩放与平移。
 *
 * 单元测试目标：
 * 1. handleZoom 后 pathGroup 与 labelGraphic 的 postMatrix 一致；
 * 2. handlePan  后 pathGroup 与 labelGraphic 的 postMatrix 一致；
 * 3. onLayoutEnd 时 labelGraphic 的 postMatrix 被重置（与 path 行为对齐）。
 */

// 一个最小可用的 geojson 用例：两个矩形 polygon，分别命名 A / B
const MINI_GEOJSON = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: { name: 'A' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [0, 0],
            [10, 0],
            [10, 10],
            [0, 10],
            [0, 0]
          ]
        ]
      }
    },
    {
      type: 'Feature',
      properties: { name: 'B' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [20, 0],
            [30, 0],
            [30, 10],
            [20, 10],
            [20, 0]
          ]
        ]
      }
    }
  ]
};

describe('map series roam label sync (issue #4585)', () => {
  let canvasDom: HTMLCanvasElement;
  let vchart: VChart;

  beforeAll(() => {
    VChart.registerMap('issue-4585-map', MINI_GEOJSON as any);
  });

  beforeEach(() => {
    canvasDom = createCanvas();
    canvasDom.style.position = 'relative';
    canvasDom.style.width = '500px';
    canvasDom.style.height = '500px';
    canvasDom.width = 500;
    canvasDom.height = 500;
  });

  afterEach(() => {
    if (vchart) {
      vchart.release();
    }
    removeDom(canvasDom);
  });

  const createMapVChart = async () => {
    const spec: IMapChartSpec = {
      type: 'map',
      map: 'issue-4585-map',
      nameField: 'name',
      valueField: 'value',
      nameProperty: 'name',
      data: [
        {
          values: [
            { name: 'A', value: 1 },
            { name: 'B', value: 2 }
          ]
        }
      ],
      label: { visible: true },
      region: [{ roam: true }],
      animation: false
    } as IMapChartSpec;

    vchart = new VChart(spec, {
      renderCanvas: canvasDom,
      animation: false,
      autoFit: true
    });
    await vchart.renderAsync();
    return (vchart.getChart() as any).getAllSeries()[0] as MapSeries;
  };

  it('handleZoom 后 pathGroup 与 labelGraphic 的 postMatrix 同步', async () => {
    const series = await createMapVChart();
    const pathGroup = series.getRootMark().getProduct() as any;
    const labelGraphic = (series as any)._labelMark?.getComponent()?.getComponent();

    expect(labelGraphic).toBeTruthy();
    expect(pathGroup.attribute.postMatrix).toBeFalsy();
    expect(labelGraphic.attribute.postMatrix).toBeFalsy();

    // 模拟 GeoCoordinate 派发的 zoom 事件
    series.handleZoom({
      scale: 1.5,
      scaleCenter: { x: 250, y: 250 }
    } as any);

    const pathM = pathGroup.attribute.postMatrix;
    const labelM = labelGraphic.attribute.postMatrix;

    expect(pathM).toBeTruthy();
    expect(labelM).toBeTruthy();
    expect(labelM.a).toBeCloseTo(pathM.a);
    expect(labelM.d).toBeCloseTo(pathM.d);
    expect(labelM.e).toBeCloseTo(pathM.e);
    expect(labelM.f).toBeCloseTo(pathM.f);

    // 1.5 倍缩放分量
    expect(labelM.a).toBeCloseTo(1.5);
    expect(labelM.d).toBeCloseTo(1.5);
  });

  it('handleZoom scale=1 时 不应创建 postMatrix', async () => {
    const series = await createMapVChart();
    const pathGroup = series.getRootMark().getProduct() as any;
    const labelGraphic = (series as any)._labelMark?.getComponent()?.getComponent();

    series.handleZoom({
      scale: 1,
      scaleCenter: { x: 250, y: 250 }
    } as any);

    expect(pathGroup.attribute.postMatrix).toBeFalsy();
    expect(labelGraphic.attribute.postMatrix).toBeFalsy();
  });

  it('handlePan 后 pathGroup 与 labelGraphic 的 postMatrix 同步平移', async () => {
    const series = await createMapVChart();
    const pathGroup = series.getRootMark().getProduct() as any;
    const labelGraphic = (series as any)._labelMark?.getComponent()?.getComponent();

    series.handlePan({ delta: [20, -10] } as any);

    const pathM = pathGroup.attribute.postMatrix;
    const labelM = labelGraphic.attribute.postMatrix;

    expect(pathM).toBeTruthy();
    expect(labelM).toBeTruthy();
    expect(labelM.e).toBeCloseTo(pathM.e);
    expect(labelM.f).toBeCloseTo(pathM.f);
    expect(labelM.e).toBeCloseTo(20);
    expect(labelM.f).toBeCloseTo(-10);
  });

  it('handlePan delta=[0,0] 时 不应创建 postMatrix', async () => {
    const series = await createMapVChart();
    const pathGroup = series.getRootMark().getProduct() as any;
    const labelGraphic = (series as any)._labelMark?.getComponent()?.getComponent();

    series.handlePan({ delta: [0, 0] } as any);

    expect(pathGroup.attribute.postMatrix).toBeFalsy();
    expect(labelGraphic.attribute.postMatrix).toBeFalsy();
  });

  it('连续多次缩放 后 path 与 label 的 postMatrix 始终保持一致', async () => {
    const series = await createMapVChart();
    const pathGroup = series.getRootMark().getProduct() as any;
    const labelGraphic = (series as any)._labelMark?.getComponent()?.getComponent();

    series.handleZoom({ scale: 1.5, scaleCenter: { x: 250, y: 250 } } as any);
    series.handleZoom({ scale: 0.8, scaleCenter: { x: 200, y: 200 } } as any);
    series.handlePan({ delta: [5, 5] } as any);

    const pathM = pathGroup.attribute.postMatrix;
    const labelM = labelGraphic.attribute.postMatrix;

    expect(labelM.a).toBeCloseTo(pathM.a);
    expect(labelM.b).toBeCloseTo(pathM.b);
    expect(labelM.c).toBeCloseTo(pathM.c);
    expect(labelM.d).toBeCloseTo(pathM.d);
    expect(labelM.e).toBeCloseTo(pathM.e);
    expect(labelM.f).toBeCloseTo(pathM.f);
  });

  it('onLayoutEnd 触发后 labelGraphic 的 postMatrix 应当被重置', async () => {
    const series = await createMapVChart();
    const labelGraphic = (series as any)._labelMark?.getComponent()?.getComponent();

    // 先模拟一次缩放，制造 postMatrix
    series.handleZoom({ scale: 1.5, scaleCenter: { x: 250, y: 250 } } as any);
    expect(labelGraphic.attribute.postMatrix).toBeTruthy();
    expect(labelGraphic.attribute.postMatrix.a).toBeCloseTo(1.5);

    // 触发 series.onLayoutEnd，预期 postMatrix 被重置为单位矩阵
    series.onLayoutEnd();

    const labelM: Matrix = labelGraphic.attribute.postMatrix;
    expect(labelM).toBeTruthy();
    expect(labelM.a).toBeCloseTo(1);
    expect(labelM.d).toBeCloseTo(1);
    expect(labelM.b).toBeCloseTo(0);
    expect(labelM.c).toBeCloseTo(0);
    expect(labelM.e).toBeCloseTo(0);
    expect(labelM.f).toBeCloseTo(0);
  });
});
