import { DataSet } from '@visactor/vdataset';
import type { ISeriesOption } from '../../../src/series/interface';
import { LiquidSeries } from '../../../src';
import { initChartDataSet, seriesOption } from '../../util/context';
import { TestRegion } from '../../util/factory/region';

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
