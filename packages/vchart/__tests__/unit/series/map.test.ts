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

/**
 * Issue #4585 回归补充（PR #4592 review）
 *
 * 这些测试经过真实的 zoom 派发、数据更新与共享标签布局，断言「最终文本位置」而不仅仅是内部矩阵，
 * 用于覆盖以下两个此前未被 PR 原单测覆盖的问题：
 *
 * [P1] 缩放后更新数据，标签被重复变换：
 *      dispatchZoom(1.5) 之后仅更新区域数值（地理数据不变）再 updateDataSync，
 *      标签基准位置被投影重新编码（已含缩放），残留的 postMatrix 再次叠加，导致标签偏移。
 *      普通 map 图表与 common 图表中的 map 系列都会复现。
 *
 * [P2] 多系列共享标签组件时，同一次交互会重复应用变换：
 *      同一 geo region 下两个 map 系列的 label mark 指向同一个标签组件，
 *      两个系列的 handleZoom() 各执行一次 scale()，一次 1.5 倍缩放后标签矩阵变成 2.25 倍。
 */

const SCALE = 1.5;
const SCALE_CENTER = { x: 250, y: 250 };
// 文本最终位置的允许误差（亚像素舍入）
const TOL = 2;

interface LabelCenter {
  text: string;
  cx: number;
  cy: number;
}

/** 遍历标签组件，收集所有文本图元的世界包围盒中心 */
function collectLabelCenters(labelGraphic: any): LabelCenter[] {
  const out: LabelCenter[] = [];
  const walk = (node: any) => {
    if (!node) {
      return;
    }
    if (node.type === 'text') {
      const g = node.globalAABBBounds;
      out.push({
        text: `${node.attribute.text}`,
        cx: (g.x1 + g.x2) / 2,
        cy: (g.y1 + g.y2) / 2
      });
    }
    if (typeof node.forEachChildren === 'function') {
      node.forEachChildren((child: any) => walk(child));
    }
  };
  walk(labelGraphic);
  return out.sort((a, b) => (a.text < b.text ? -1 : a.text > b.text ? 1 : 0));
}

function getLabelGraphic(series: MapSeries): any {
  return (series as any)._labelMark?.getComponent()?.getComponent();
}

function expectCentersClose(actual: LabelCenter[], expected: LabelCenter[]) {
  expect(actual.length).toBe(expected.length);
  expect(actual.length).toBeGreaterThan(0);
  actual.forEach((cur, i) => {
    const exp = expected[i];
    expect(cur.text).toBe(exp.text);
    expect(cur.cx).toBeCloseTo(exp.cx, 0);
    expect(cur.cy).toBeCloseTo(exp.cy, 0);
    expect(Math.abs(cur.cx - exp.cx)).toBeLessThanOrEqual(TOL);
    expect(Math.abs(cur.cy - exp.cy)).toBeLessThanOrEqual(TOL);
  });
}

function makeCanvas(): HTMLCanvasElement {
  const canvasDom = createCanvas();
  canvasDom.style.position = 'relative';
  canvasDom.style.width = '500px';
  canvasDom.style.height = '500px';
  canvasDom.width = 500;
  canvasDom.height = 500;
  return canvasDom;
}

describe('map series roam label - regression (issue #4585 / PR #4592 review)', () => {
  const canvasList: HTMLCanvasElement[] = [];
  const chartList: VChart[] = [];

  beforeAll(() => {
    VChart.registerMap('map-review-map', MINI_GEOJSON as any);
  });

  afterEach(() => {
    while (chartList.length) {
      chartList.pop()?.release();
    }
    while (canvasList.length) {
      removeDom(canvasList.pop() as HTMLCanvasElement);
    }
  });

  const createSingleMapChart = async () => {
    const canvasDom = makeCanvas();
    canvasList.push(canvasDom);
    const spec: IMapChartSpec = {
      type: 'map',
      map: 'map-review-map',
      nameField: 'name',
      valueField: 'value',
      nameProperty: 'name',
      data: [
        {
          id: 'data',
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

    const vchart = new VChart(spec, { renderCanvas: canvasDom, animation: false, autoFit: true });
    chartList.push(vchart);
    await vchart.renderAsync();
    return vchart;
  };

  const createCommonMapChart = async (seriesCount: number) => {
    const canvasDom = makeCanvas();
    canvasList.push(canvasDom);
    const series = [] as any[];
    for (let i = 0; i < seriesCount; i++) {
      series.push({
        type: 'map',
        map: 'map-review-map',
        nameField: 'name',
        valueField: 'value',
        nameProperty: 'name',
        regionIndex: 0,
        data: {
          id: `data-${i}`,
          values: [
            { name: 'A', value: 1 },
            { name: 'B', value: 2 }
          ]
        },
        label: { visible: true }
      });
    }
    const spec: any = {
      type: 'common',
      // 文档化的多系列共享标签布局
      labelLayout: 'region',
      series,
      region: [{ coordinate: 'geo', roam: true }],
      animation: false
    };
    const vchart = new VChart(spec, { renderCanvas: canvasDom, animation: false, autoFit: true });
    chartList.push(vchart);
    await vchart.renderAsync();
    return vchart;
  };

  const firstSeries = (vchart: VChart): MapSeries => (vchart.getChart() as any).getAllSeries()[0] as MapSeries;

  it('[基准] 普通 map 缩放后标签跟随地图（纯交互）', async () => {
    const vchart = await createSingleMapChart();
    const series = firstSeries(vchart);
    const labelGraphic = getLabelGraphic(series);
    const pathGroup = series.getRootMark().getProduct() as any;

    const before = collectLabelCenters(labelGraphic);
    (vchart as any).geoZoomByIndex(0, SCALE, SCALE_CENTER);
    const after = collectLabelCenters(labelGraphic);

    // 标签确实随缩放移动
    expect(after.length).toBe(before.length);
    const moved = after.some((c, i) => Math.abs(c.cx - before[i].cx) > TOL || Math.abs(c.cy - before[i].cy) > TOL);
    expect(moved).toBe(true);

    // 标签矩阵与地图矩阵保持一致
    const pathM = pathGroup.attribute.postMatrix;
    const labelM = labelGraphic.attribute.postMatrix;
    expect(labelM.a).toBeCloseTo(pathM.a);
    expect(labelM.d).toBeCloseTo(pathM.d);
    expect(labelM.e).toBeCloseTo(pathM.e);
    expect(labelM.f).toBeCloseTo(pathM.f);
    expect(labelM.a).toBeCloseTo(SCALE);
  });

  it('[基准] 普通 map 平移后标签跟随地图（纯交互）', async () => {
    const vchart = await createSingleMapChart();
    const series = firstSeries(vchart);
    const labelGraphic = getLabelGraphic(series);
    const pathGroup = series.getRootMark().getProduct() as any;

    const before = collectLabelCenters(labelGraphic);
    series.handlePan({ delta: [30, -20] } as any);
    const after = collectLabelCenters(labelGraphic);

    // 文本整体平移了 (30, -20)
    after.forEach((c, i) => {
      expect(c.cx - before[i].cx).toBeCloseTo(30, 0);
      expect(c.cy - before[i].cy).toBeCloseTo(-20, 0);
    });

    const pathM = pathGroup.attribute.postMatrix;
    const labelM = labelGraphic.attribute.postMatrix;
    expect(labelM.e).toBeCloseTo(pathM.e);
    expect(labelM.f).toBeCloseTo(pathM.f);
  });

  it('[P1] 普通 map 缩放后更新数据，标签不应被重复变换', async () => {
    // 参照：仅缩放（不更新数据）后的正确文本位置
    const refChart = await createSingleMapChart();
    (refChart as any).geoZoomByIndex(0, SCALE, SCALE_CENTER);
    const expected = collectLabelCenters(getLabelGraphic(firstSeries(refChart)));

    // 复现：缩放后仅更新区域数值（地理数据不变）再更新数据
    const vchart = await createSingleMapChart();
    const series = firstSeries(vchart);
    (vchart as any).geoZoomByIndex(0, SCALE, SCALE_CENTER);
    vchart.updateDataSync('data', [
      { name: 'A', value: 100 },
      { name: 'B', value: 200 }
    ]);
    const actual = collectLabelCenters(getLabelGraphic(series));

    expectCentersClose(actual, expected);
  });

  it('[P1] common 图 map 系列缩放后更新数据，标签不应被重复变换', async () => {
    const refChart = await createCommonMapChart(1);
    (refChart as any).geoZoomByIndex(0, SCALE, SCALE_CENTER);
    const expected = collectLabelCenters(getLabelGraphic(firstSeries(refChart)));

    const vchart = await createCommonMapChart(1);
    const series = firstSeries(vchart);
    (vchart as any).geoZoomByIndex(0, SCALE, SCALE_CENTER);
    vchart.updateDataSync('data-0', [
      { name: 'A', value: 100 },
      { name: 'B', value: 200 }
    ]);
    const actual = collectLabelCenters(getLabelGraphic(series));

    expectCentersClose(actual, expected);
  });

  it('[P2] 多系列共享标签时，一次缩放只应变换一次', async () => {
    // 参照：单系列缩放后的正确文本位置与矩阵
    const singleChart = await createCommonMapChart(1);
    (singleChart as any).geoZoomByIndex(0, SCALE, SCALE_CENTER);
    const expected = collectLabelCenters(getLabelGraphic(firstSeries(singleChart)));

    // 复现：两个 map 系列共享同一标签组件
    const vchart = await createCommonMapChart(2);
    const seriesList = (vchart.getChart() as any).getAllSeries() as MapSeries[];
    const labelGraphic0 = getLabelGraphic(seriesList[0]);
    const labelGraphic1 = getLabelGraphic(seriesList[1]);
    // 文档化的 labelLayout: 'region' 下两个系列共享同一个标签组件
    expect(labelGraphic0).toBe(labelGraphic1);

    const pathGroup0 = seriesList[0].getRootMark().getProduct() as any;

    (vchart as any).geoZoomByIndex(0, SCALE, SCALE_CENTER);

    // 共享标签矩阵应与地图矩阵一致（1.5 而不是 2.25）
    const labelM = labelGraphic0.attribute.postMatrix;
    const pathM = pathGroup0.attribute.postMatrix;
    expect(labelM.a).toBeCloseTo(SCALE);
    expect(labelM.d).toBeCloseTo(SCALE);
    expect(labelM.a).toBeCloseTo(pathM.a);
    expect(labelM.d).toBeCloseTo(pathM.d);
    expect(labelM.e).toBeCloseTo(pathM.e);
    expect(labelM.f).toBeCloseTo(pathM.f);

    // 共享标签的最终文本位置应与单系列一致
    const actual = collectLabelCenters(labelGraphic0);
    expectCentersClose(actual, expected);
  });

  it('[P2] 多系列共享标签时，一次平移只应变换一次', async () => {
    // 参照：单系列平移后的正确文本位置与矩阵
    const singleChart = await createCommonMapChart(1);
    const singleSeries = firstSeries(singleChart);
    singleSeries.handlePan({ delta: [40, -25] } as any);
    const expected = collectLabelCenters(getLabelGraphic(singleSeries));

    // 复现：两个 map 系列共享同一标签组件，模拟 GeoCoordinate 向两个系列各派发一次 panmove
    const vchart = await createCommonMapChart(2);
    const seriesList = (vchart.getChart() as any).getAllSeries() as MapSeries[];
    const labelGraphic = getLabelGraphic(seriesList[0]);
    expect(getLabelGraphic(seriesList[1])).toBe(labelGraphic);
    const pathGroup0 = seriesList[0].getRootMark().getProduct() as any;

    // 同一次事件派发：两个系列拿到的是同一个 delta 引用（事件派发时的浅拷贝共享子对象）
    const sharedEvent = { delta: [40, -25] as [number, number] };
    seriesList.forEach(s => s.handlePan(sharedEvent as any));

    const labelM = labelGraphic.attribute.postMatrix;
    const pathM = pathGroup0.attribute.postMatrix;
    expect(labelM.e).toBeCloseTo(40);
    expect(labelM.f).toBeCloseTo(-25);
    expect(labelM.e).toBeCloseTo(pathM.e);
    expect(labelM.f).toBeCloseTo(pathM.f);

    const actual = collectLabelCenters(labelGraphic);
    expectCentersClose(actual, expected);
  });
});
