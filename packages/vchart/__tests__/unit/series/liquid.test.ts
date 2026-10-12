import { DataSet } from '@visactor/vdataset';
import type { ISeriesOption } from '../../../src/series/interface';
import VChart, { LiquidSeries, registerLiquidChart } from '../../../src';
import { initChartDataSet, seriesOption } from '../../util/context';
import { TestRegion } from '../../util/factory/region';
import { createDiv, removeDom } from '../../util/dom';

const dataSet = new DataSet();
initChartDataSet(dataSet);

let ctx: ISeriesOption;

const createLiquidSeries = (value: number, reverse: boolean = false) => {
  const region = new TestRegion({
    getLayoutRect: () => ({ width: 200, height: 100 }),
    getLayoutStartPoint: () => ({ x: 0, y: 0 })
  });
  ctx = seriesOption({ dataSet });
  ctx.region = region as any;

  const liquid = new LiquidSeries<any>(
    {
      valueField: 'value',
      reverse,
      outlineMargin: 0,
      outlinePadding: 0,
      maskShape: 'rect'
    },
    ctx
  );

  liquid.setValueField('value');
  (liquid as any)._region = region;
  (liquid as any)._marginSpec = {};
  (liquid as any)._paddingSpec = {};
  (liquid as any)._maskShape = 'rect';
  (liquid as any)._reverse = reverse;
  (liquid as any)._data = {
    updateData: jest.fn(),
    getLatestData: () => [{ value }]
  };

  liquid.viewDataUpdate({} as any);
  return liquid;
};

describe('[Domain-Series-Liquid] Liquid Series', () => {
  test('clamps values above 1 when calculating liquid geometry', () => {
    const liquid = createLiquidSeries(80619697.63);

    expect((liquid as any)._heightRatio).toBe(1);
    expect((liquid as any)._getLiquidHeight()).toBe(100);
    expect((liquid as any)._getLiquidPosY()).toBe(0);
  });
});

describe('Liquid explicit fillOpacity', () => {
  let chart: VChart;
  let dom: HTMLElement;
  const spec = (liquid: any): any => ({
    type: 'liquid',
    width: 200,
    height: 200,
    data: [{ id: 'data', values: [{ value: 0.5 }] }],
    valueField: 'value',
    animation: false,
    liquid
  });
  const render = (liquid: any) => {
    chart = new VChart(spec(liquid), { dom, animation: false });
    chart.renderSync();
  };
  const glyph = (): any => chart.getChart().getAllSeries()[0].getMarkInName('liquid')!.getGraphics()[0];
  const values = () =>
    glyph()
      .getSubGraphic()
      .map((child: any) => child.attribute.fillOpacity);

  beforeAll(() => registerLiquidChart());
  beforeEach(() => {
    dom = createDiv();
  });
  afterEach(() => {
    chart?.release();
    removeDom(dom);
  });

  test.each([0, 0.4, 1])('initial fillOpacity %s overrides all waves', value => {
    render({ style: { fillOpacity: value } });
    expect(glyph().attribute.fillOpacity).toBe(value);
    expect(values()).toEqual([value, value, value]);
  });

  test('updateSpecSync changes the opacity of all waves', () => {
    render({});
    expect(values()).toEqual([1, 0.66, 0.33]);
    for (const value of [0, 0.4, 1]) {
      chart.updateSpecSync(spec({ style: { fillOpacity: value } }));
      expect(glyph().attribute.fillOpacity).toBe(value);
      expect(values()).toEqual([value, value, value]);
    }
  });

  test.each([undefined, 0.4])('configured hover restores normal opacity %s', normalOpacity => {
    render({
      ...(normalOpacity === undefined ? {} : { style: { fillOpacity: normalOpacity } }),
      state: { hover: { fillOpacity: 0 } }
    });
    const normal = normalOpacity === undefined ? [1, 0.66, 0.33] : [normalOpacity, normalOpacity, normalOpacity];
    expect(values()).toEqual(normal);
    glyph().setStates(['hover'], false);
    expect(glyph().attribute.fillOpacity).toBe(0);
    expect(values()).toEqual([0, 0, 0]);
    glyph().clearStates(false);
    expect(values()).toEqual(normal);
  });
});
