import { GlobalScale } from '../../../../../src/scale/global-scale';
import { DataSet, csvParser } from '@visactor/vdataset';
import { dimensionStatistics } from '../../../../../src/data/transforms/dimension-statistics';
import type { CartesianLinearAxis } from '../../../../../src/index';
// eslint-disable-next-line no-duplicate-imports
import { CartesianAxis } from '../../../../../src/index';
import { ComponentTypeEnum, type IComponent, type IComponentOption } from '../../../../../src/component/interface';
import { EventDispatcher } from '../../../../../src/event/event-dispatcher';
import { getTestCompiler } from '../../../../util/factory/compiler';
import { getTheme, initChartDataSet } from '../../../../util/context';
import { getCartesianAxisInfo } from '../../../../../src/component/axis/cartesian/util';

const dataSet = new DataSet();
initChartDataSet(dataSet);
dataSet.registerParser('csv', csvParser);
dataSet.registerTransform('dimensionStatistics', dimensionStatistics);

const ctx: IComponentOption = {
  type: ComponentTypeEnum.cartesianLinearAxis,
  eventDispatcher: new EventDispatcher({} as any, { addEventListener: () => {} } as any) as any,
  dataSet,
  map: new Map(),
  mode: 'desktop-browser',
  globalInstance: {
    isAnimationEnable: () => true,
    getContainer: () => ({}),
    getTooltipHandlerByUser: (() => undefined) as () => undefined
  } as any,
  getCompiler: getTestCompiler,
  getAllRegions: () => [],
  getRegionsInIndex: () => [],
  getChart: () => ({ getSpec: () => ({}) } as any),
  getRegionsInIds: () => [],
  getRegionsInUserIdOrIndex: () => [],
  getAllSeries: () => [],
  getSeriesInIndex: () => [],
  getSeriesInIds: () => [],
  getSeriesInUserIdOrIndex: () => [],
  getAllComponents: () => [],
  getComponentByIndex: () => undefined,
  getComponentsByKey: () => [],
  getComponentsByType: () => [],
  getChartLayoutRect: () => ({ width: 0, height: 0, x: 0, y: 0 }),
  getChartViewRect: () => ({ width: 500, height: 500 } as any),
  globalScale: new GlobalScale([], { getAllSeries: () => [] as any[] } as any),
  getTheme: getTheme,
  getComponentByUserId: () => undefined,
  animation: false,
  onError: () => {},
  getSeriesData: () => undefined
};

const getAxisSpec = (spec: any) => ({
  sampling: 'simple',
  ...spec
});

describe('LinearAxis customDistribution', () => {
  beforeAll(() => {
    // @ts-ignore
    jest.spyOn(CartesianAxis.prototype, 'collectData').mockImplementation(() => {
      return [{ min: 0, max: 10 }];
    });
  });

  test('should create piecewise domain and range from customDistribution', () => {
    // Mock getNewScaleRange to return [0, 100]
    // @ts-ignore
    jest.spyOn(CartesianAxis.prototype, 'getNewScaleRange').mockReturnValue([0, 100]);

    let spec = getAxisSpec({
      orient: 'left',
      customDistribution: [
        { domain: [0, 5], ratio: 0.8 },
        { domain: [5, 10], ratio: 0.2 }
      ]
    });

    const transformer = new CartesianAxis.transformerConstructor({
      type: 'cartesianAxis-linear',
      getTheme: getTheme,
      mode: 'desktop-browser'
    });
    spec = transformer.transformSpec(spec, {}).spec;
    const linearAxis = CartesianAxis.createComponent(
      {
        type: getCartesianAxisInfo(spec).componentName,
        spec
      },
      ctx
    ) as CartesianLinearAxis;

    linearAxis.created();
    linearAxis.init({});

    // Test Domain
    // @ts-ignore
    linearAxis.updateScaleDomain();
    const scale = linearAxis.getScale();
    expect(scale.domain()).toEqual([0, 5, 10]);

    // Test Range
    // @ts-ignore
    const newRange = linearAxis.getNewScaleRange();
    // 0 -> 0
    // 5 -> 0 + 0.8 * 100 = 80
    // 10 -> 80 + 0.2 * 100 = 100
    expect(newRange).toEqual([0, 80, 100]);
  });

  test('should handle gaps in customDistribution', () => {
    let spec = getAxisSpec({
      orient: 'left',
      customDistribution: [
        { domain: [0, 5], ratio: 0.4 },
        // Gap 5-8
        { domain: [8, 10], ratio: 0.4 }
      ]
    });

    const transformer = new CartesianAxis.transformerConstructor({
      type: 'cartesianAxis-linear',
      getTheme: getTheme,
      mode: 'desktop-browser'
    });
    spec = transformer.transformSpec(spec, {}).spec;
    const linearAxis = CartesianAxis.createComponent(
      {
        type: getCartesianAxisInfo(spec).componentName,
        spec
      },
      ctx
    ) as CartesianLinearAxis;

    linearAxis.created();
    linearAxis.init({});

    // @ts-ignore
    linearAxis.updateScaleDomain();
    const scale = linearAxis.getScale();
    expect(scale.domain()).toEqual([0, 5, 8, 10]);
  });
});
