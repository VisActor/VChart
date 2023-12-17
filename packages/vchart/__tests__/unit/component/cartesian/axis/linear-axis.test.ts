import { GlobalScale } from '../../../../../src/scale/global-scale';
import type { IEventDispatcher } from '../../../../../src/event/interface';
/* eslint-disable no-lone-blocks */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { DataSet, csvParser } from '@visactor/vdataset';
import { dimensionStatistics } from '../../../../../src/data/transforms/dimension-statistics';
import type { CartesianLinearAxis } from '../../../../../src/index';
// eslint-disable-next-line no-duplicate-imports
import { CartesianAxis, ThemeManager } from '../../../../../src/index';
import { ComponentTypeEnum, type IComponent, type IComponentOption } from '../../../../../src/component/interface';
import { EventDispatcher } from '../../../../../src/event/event-dispatcher';
import { getTestCompiler } from '../../../../util/factory/compiler';
import { initChartDataSet } from '../../../../util/context';
import type { StringOrNumber } from '../../../../../src/typings/common';
import type { CartesianAxisSpecTransformer } from '../../../../../src/component/axis/cartesian';
import { getCartesianAxisInfo } from '../../../../../src/component/axis/cartesian/util';

const dataSet = new DataSet();
initChartDataSet(dataSet);
dataSet.registerParser('csv', csvParser);
dataSet.registerTransform('dimensionStatistics', dimensionStatistics);
// const dataView = new DataView(dataSet);
// const data = `x,type,y
// 1,1,850
// 2,2,740
// 3,3,901
// 4,4,569
// 5,5,670`;
// dataView.parse(data, {
//   type: 'csv'
// });
// /**
//  * By default, the data.y statistics range is [569, 901].
//  *
//  */
// const statisticData = new DataView(dataSet);
// statisticData.parse([dataView], { type: 'dataview' }).transform({
//   type: 'dimensionStatistics',
//   options: {
//     operations: ['max', 'min', 'values'],
//     fields: ['x', 'y', undefined]
//   }
// });

const ctx: IComponentOption = {
  type: ComponentTypeEnum.cartesianLinearAxis,
  // region: {} as any,
  eventDispatcher: new EventDispatcher({} as any, { addEventListener: () => {} } as any) as IEventDispatcher,
  dataSet,
  map: new Map(),
  mode: 'desktop-browser',
  globalInstance: {
    getContainer: () => ({}),
    getTooltipHandlerByUser: (() => undefined) as () => undefined
  } as any,
  getCompiler: getTestCompiler,
  getAllRegions: () => [],
  getRegionsInIndex: () => {
    return [];
  },
  getChart: () =>
    ({
      getSpec() {
        return {};
      }
    } as any),
  getRegionsInIds: () => {
    return [];
  },
  getRegionsInUserIdOrIndex: () => {
    return [];
  },
  getAllSeries: () => [],
  getSeriesInIndex: () => {
    return [];
  },
  getSeriesInIds: () => {
    return [];
  },
  getSeriesInUserIdOrIndex: () => {
    return [];
  },
  getAllComponents: () => [],
  getComponentByIndex: (key: string, index: number) => {
    return undefined;
  },
  getComponentsByKey: (key: string) => {
    return [];
  },
  getChartLayoutRect: () => {
    return { width: 0, height: 0, x: 0, y: 0 };
  },
  getChartViewRect: () => {
    return { width: 500, height: 500 } as any;
  },
  globalScale: new GlobalScale([], { getAllSeries: () => [] as any[] } as any),
  getTheme: () => ThemeManager.getCurrentTheme(),
  getComponentByUserId: function (user_id: string | number): IComponent | undefined {
    throw new Error('Function not implemented.');
  },
  animation: false,
  onError: () => {},
  getSeriesData: (id: StringOrNumber | undefined, index: number | undefined) => undefined
};

const getAxisSpec = (spec: any) => {
  return {
    sampling: 'simple',
    ...spec
  };
};

beforeAll(() => {
  // @ts-ignore
  jest.spyOn(CartesianAxis.prototype, 'collectData').mockImplementation(() => {
    return [{ min: 569, max: 901 }];
  });
});

/**
 * By default,`zero` is configured `true`, `nice` is configured `true`
 * As a result, the left linear axis domain should be [0, 1000].
 *
 */
test('config linearAxis.nice default [true] ', () => {
  let spec = getAxisSpec({
    orient: 'left'
  });
  const transformer = new CartesianAxis.transformerConstructor({
    type: 'cartesianAxis-linear',
    getTheme: () => ThemeManager.getCurrentTheme()
  }) as CartesianAxisSpecTransformer;
  spec = transformer.transformSpec(spec, {}).spec;
  const linearAxis = CartesianAxis.createComponent(
    {
      type: getCartesianAxisInfo(spec).componentName,
      spec
    },
    ctx
  );

  linearAxis.created();
  linearAxis.init({});
  // @ts-ignore
  linearAxis.updateScaleDomain();
  const scale = linearAxis.getScale();
  expect(scale.domain()).toEqual([0, 1000]);
});

test('config linearAxis.nice default [true] ', () => {
  let spec = getAxisSpec({
    orient: 'left',
    tick: { tickMode: 'd3' }
  });
  const transformer = new CartesianAxis.transformerConstructor({
    type: 'cartesianAxis-linear',
    getTheme: () => ThemeManager.getCurrentTheme()
  }) as CartesianAxisSpecTransformer;
  spec = transformer.transformSpec(spec, {}).spec;
  const linearAxis = CartesianAxis.createComponent(
    {
      type: getCartesianAxisInfo(spec).componentName,
      spec
    },
    ctx
  );

  linearAxis.created();
  linearAxis.init({});
  // @ts-ignore
  linearAxis.updateScaleDomain();
  const scale = linearAxis.getScale();
  expect(scale.domain()).toEqual([0, 1000]);
});

test('nice === false  ', () => {
  let spec = getAxisSpec({
    orient: 'left',
    nice: false
  });
  const transformer = new CartesianAxis.transformerConstructor({
    type: 'cartesianAxis-linear',
    getTheme: () => ThemeManager.getCurrentTheme()
  }) as CartesianAxisSpecTransformer;
  spec = transformer.transformSpec(spec, {}).spec;
  const linearAxis = CartesianAxis.createComponent(
    {
      type: getCartesianAxisInfo(spec).componentName,
      spec
    },
    ctx
  );

  linearAxis.created();
  linearAxis.init({});
  // @ts-ignore
  linearAxis.updateScaleDomain();
  const scale = linearAxis.getScale();
  expect(scale.domain()).toEqual([0, 901]);
});

test('zero === false && nice === false  ', () => {
  let spec = getAxisSpec({
    orient: 'left',
    nice: false,
    zero: false
  });
  const transformer = new CartesianAxis.transformerConstructor({
    type: 'cartesianAxis-linear',
    getTheme: () => ThemeManager.getCurrentTheme()
  }) as CartesianAxisSpecTransformer;
  spec = transformer.transformSpec(spec, {}).spec;
  const linearAxis = CartesianAxis.createComponent(
    {
      type: getCartesianAxisInfo(spec).componentName,
      spec
    },
    ctx
  );

  linearAxis.created();
  linearAxis.init({});
  // @ts-ignore
  linearAxis.updateScaleDomain();
  const scale = linearAxis.getScale();
  expect(scale.domain()).toEqual([569, 901]);
});

test('zero === true && range is specific  ', () => {
  let config = getAxisSpec({
    orient: 'left',
    range: {
      min: 10,
      max: 800
    }
  });
  const transformer = new CartesianAxis.transformerConstructor({
    type: 'cartesianAxis-linear',
    getTheme: () => ThemeManager.getCurrentTheme()
  }) as CartesianAxisSpecTransformer;
  config = transformer.transformSpec(config, {}).spec;

  /**
   * range is the highest priority, which will be the direct result for scale.domain.
   *
   */
  {
    const linearAxis = CartesianAxis.createComponent(
      {
        type: getCartesianAxisInfo(config).componentName,
        spec: config
      },
      ctx
    );
    linearAxis.created();
    linearAxis.init({});
    // @ts-ignore
    linearAxis.updateScaleDomain();
    const scale = linearAxis.getScale();
    expect(scale.domain()).toEqual([10, 800]);
  }
  {
    const spec = { ...config, range: { min: -10, max: 2000 } };
    const linearAxis = CartesianAxis.createComponent(
      {
        type: getCartesianAxisInfo(spec).componentName,
        spec
      },
      ctx
    );
    linearAxis.created();
    linearAxis.init({});
    // @ts-ignore
    linearAxis.updateScaleDomain();
    const scale = linearAxis.getScale();
    expect(scale.domain()).toEqual([-10, 2000]);
  }
  {
    // range优先级要高于nice，一旦设置了max/min，nice不应该改变相应的值
    const spec = { ...config, zero: false, range: { max: 599 } };
    const linearAxis = CartesianAxis.createComponent(
      {
        type: getCartesianAxisInfo(spec).componentName,
        spec
      },
      ctx
    );
    linearAxis.created();
    linearAxis.init({});
    // @ts-ignore
    linearAxis.updateScaleDomain();
    const scale = linearAxis.getScale();
    expect(scale.domain()).toEqual([565, 599]);
  }
  {
    // range优先级要高于nice，一旦设置了max/min，nice不应该改变相应的值(d3 tick)
    const spec = { ...config, zero: false, range: { max: 599 }, tick: { tickMode: 'd3' } };
    const linearAxis = CartesianAxis.createComponent(
      {
        type: getCartesianAxisInfo(spec).componentName,
        spec
      },
      ctx
    );
    linearAxis.created();
    linearAxis.init({});
    // @ts-ignore
    linearAxis.updateScaleDomain();
    const scale = linearAxis.getScale();
    expect(scale.domain()).toEqual([565, 599]);
  }
  {
    // range优先级要高于nice，一旦设置了max/min，nice不应该改变相应的值
    const spec = { ...config, zero: false, range: { min: 199 } };
    const linearAxis = CartesianAxis.createComponent(
      {
        type: getCartesianAxisInfo(spec).componentName,
        spec
      },
      ctx
    );
    linearAxis.created();
    linearAxis.init({});
    // @ts-ignore
    linearAxis.updateScaleDomain();
    const scale = linearAxis.getScale();
    expect(scale.domain()).toEqual([199, 1000]);
  }
});

test('expand', () => {
  let config = getAxisSpec({
    orient: 'left',
    expand: { max: 0.1, min: 0.1 }
  });
  const transformer = new CartesianAxis.transformerConstructor({
    type: 'cartesianAxis-linear',
    getTheme: () => ThemeManager.getCurrentTheme()
  }) as CartesianAxisSpecTransformer;
  config = transformer.transformSpec(config, {}).spec;

  {
    const linearAxis = CartesianAxis.createComponent(
      {
        type: getCartesianAxisInfo(config).componentName,
        spec: config
      },
      ctx
    );
    linearAxis.created();
    linearAxis.init({});
    // @ts-ignore
    linearAxis.updateScaleDomain();
    const scale = linearAxis.getScale();
    expect(scale.domain()).toEqual([0, 1000]);
  }

  /**
   * `range` is the highest priority, which will be the direct result for scale.domain.
   * `expand.min` will not affect domain.min.
   *    origin: [569, 901]
   * => with expand.min/max: [602.2, 934.2]
   * => with range.min: [500, 934.2]
   * => with nice: [500, 950]
   */
  {
    const spec = { ...config, range: { min: 500 } };
    const linearAxis = CartesianAxis.createComponent(
      {
        type: getCartesianAxisInfo(spec).componentName,
        spec
      },
      ctx
    );
    linearAxis.created();
    linearAxis.init({});
    // @ts-ignore
    linearAxis.updateScaleDomain();
    const scale = linearAxis.getScale();
    expect(scale.domain()).toEqual([500, 1000]);
  }
  /**
   * `range` is the highest priority, which will be the direct result for scale.domain.
   * `expand.min` will not affect domain.min.
   *    origin: [569, 901]
   * => with expand.min/max: [569, 967.4]
   * => with zero: [0, 967.4]
   * => with nice: [0, 1000]
   */
  {
    const spec = { ...config, expand: { max: 0.2 } };
    const linearAxis = CartesianAxis.createComponent(
      {
        type: getCartesianAxisInfo(spec).componentName,
        spec
      },
      ctx
    );
    linearAxis.created();
    linearAxis.init({});
    // @ts-ignore
    linearAxis.updateScaleDomain();
    const scale = linearAxis.getScale();
    expect(scale.domain()).toEqual([0, 1000]);
  }
});

test('extend', () => {
  let config = getAxisSpec({
    orient: 'left'
  });
  const transformer = new CartesianAxis.transformerConstructor({
    type: 'cartesianAxis-linear',
    getTheme: () => ThemeManager.getCurrentTheme()
  }) as CartesianAxisSpecTransformer;
  config = transformer.transformSpec(config, {}).spec;

  {
    const linearAxis = CartesianAxis.createComponent(
      {
        type: getCartesianAxisInfo(config).componentName,
        spec: config
      },
      ctx
    ) as CartesianLinearAxis;
    linearAxis.created();
    linearAxis.setExtendDomain('test', 1100);
    const scale = linearAxis.getScale();
    expect(scale.domain()).toEqual([0, 1200]);
  }

  /**
   * `range` is the highest priority, which will be the direct result for scale.domain.
   * `extend` will not affect domain.
   *    origin: [569, 901]
   * => with extend { testMin: -100, testMax: 1100 } => [-100, 1100]
   * => with range.min&max: [500, 800]
   */
  {
    const spec = { ...config, range: { min: 500, max: 800 } };
    const linearAxis = CartesianAxis.createComponent(
      {
        type: getCartesianAxisInfo(spec).componentName,
        spec
      },
      ctx
    ) as CartesianLinearAxis;
    linearAxis.created();
    linearAxis.setExtendDomain('testMin', -100);
    linearAxis.setExtendDomain('testMax', 1100);
    const scale = linearAxis.getScale();
    expect(scale.domain()).toEqual([500, 800]);
  }
});

test('niceDomain should work when domain is 0, and user does not set min or max', () => {
  // @ts-ignore
  jest.spyOn(CartesianAxis.prototype, 'collectData').mockImplementation(() => {
    return [{ min: 0, max: 0 }];
  });
  let spec = getAxisSpec({
    orient: 'left',
    nice: false,
    zero: false
  });
  const transformer = new CartesianAxis.transformerConstructor({
    type: 'cartesianAxis-linear',
    getTheme: () => ThemeManager.getCurrentTheme()
  }) as CartesianAxisSpecTransformer;
  spec = transformer.transformSpec(spec, {}).spec;
  const linearAxis = CartesianAxis.createComponent(
    {
      type: getCartesianAxisInfo(spec).componentName,
      spec
    },
    ctx
  );

  linearAxis.created();
  linearAxis.init({});
  // @ts-ignore
  linearAxis.updateScaleDomain();
  const scale = linearAxis.getScale();
  expect(scale.domain()).toEqual([0, 0]); // fix the test
});

test('niceDomain should not work when user set min or max', () => {
  // @ts-ignore
  jest.spyOn(CartesianAxis.prototype, 'collectData').mockImplementation(() => {
    return [{ min: 0, max: 5000 }];
  });
  let spec = getAxisSpec({
    orient: 'left',
    min: 300,
    max: 300
  });
  const transformer = new CartesianAxis.transformerConstructor({
    type: 'cartesianAxis-linear',
    getTheme: () => ThemeManager.getCurrentTheme()
  }) as CartesianAxisSpecTransformer;
  spec = transformer.transformSpec(spec, {}).spec;
  const linearAxis = CartesianAxis.createComponent(
    {
      type: getCartesianAxisInfo(spec).componentName,
      spec
    },
    ctx
  );

  linearAxis.created();
  linearAxis.init({});
  // @ts-ignore
  linearAxis.updateScaleDomain();
  const scale = linearAxis.getScale();
  expect(scale.domain()).toEqual([300, 300]);
});

test('dynamic tickCount', () => {
  let spec = getAxisSpec({
    orient: 'left',
    tick: {
      tickCount: (params: any) => {
        const density = 1;
        const fontSize = params.labelStyle.fontSize ?? 12;
        const height = params.axisLength;
        const count = ~~Math.max(Math.ceil(height / (fontSize * 1.5)) * (0.2 * density), 2);
        return count;
      }
    }
  });
  const transformer = new CartesianAxis.transformerConstructor({
    type: 'cartesianAxis-linear',
    getTheme: () => ThemeManager.getCurrentTheme()
  }) as CartesianAxisSpecTransformer;
  spec = transformer.transformSpec(spec, {}).spec;
  const linearAxis = CartesianAxis.createComponent(
    {
      type: getCartesianAxisInfo(spec).componentName,
      spec
    },
    ctx
  );

  linearAxis.created();
  linearAxis.init({});
  // @ts-ignore
  linearAxis.updateScaleDomain();
  {
    const scale = linearAxis.getScale();
    scale.range([0, 500]);
    // @ts-ignore
    linearAxis.computeData();
    // @ts-ignore
    const tickCount = linearAxis.getTickData().getLatestData()?.length;
    expect(tickCount).toEqual(6);
  }

  {
    const scale = linearAxis.getScale();
    scale.range([0, 1000]);
    // @ts-ignore
    linearAxis.computeData();
    // @ts-ignore
    const tickCount = linearAxis.getTickData().getLatestData()?.length;
    expect(tickCount).toEqual(11);
  }

  {
    const scale = linearAxis.getScale();
    scale.range([0, 200]);
    // @ts-ignore
    linearAxis.computeData();
    // @ts-ignore
    const tickCount = linearAxis.getTickData().getLatestData()?.length;
    expect(tickCount).toEqual(4);
  }
});
