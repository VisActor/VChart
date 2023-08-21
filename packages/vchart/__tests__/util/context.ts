import { TestRegion } from './factory/region';
import type { TestChart } from './factory/chart';
import type { IComponentOption } from '../../src/component/interface';
import type { ISeriesOption } from '../../src/series/interface';
import { EventDispatcher } from '../../src/event/event-dispatcher';
import { DataSet } from '@visactor/vdataset';
import type { IModelOption } from '../../src/model/interface';
import { ThemeManager } from '../../src/theme';
import type { IEventDispatcher } from '../../src/event/interface';
import { getTestCompiler } from './factory/compiler';
import { GlobalScale } from '../../src/scale/global-scale';
import type { IRegion } from '../../src/region/interface';

export function modelOption(opt: Partial<IModelOption> = {}, chart?: TestChart): Partial<IModelOption> {
  return {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    eventDispatcher: new EventDispatcher(
      {} as any,
      {
        addEventListener: () => {
          // do nothing
        }
      } as any
    ) as IEventDispatcher,
    dataSet: chart?._dataSet ?? new DataSet(),
    map: new Map(),
    // 编译对象 应当由外部提供
    getCompiler: chart?.getCompiler.bind(chart) ?? getTestCompiler,

    getChart: () =>
      ({
        getSpec: () => ({})
      } as any),
    getChartLayoutRect: () => {
      return { width: 500, height: 500 } as any;
    },
    getChartViewRect: () => {
      return { width: 500, height: 500 } as any;
    },
    mode: opt.mode ?? 'desktop-browser',
    globalScale: chart?.globalScale,
    ...opt
  };
}

export function seriesOption(opt: Partial<IModelOption> = {}, chart?: TestChart): ISeriesOption {
  const option = modelOption(opt) as ISeriesOption;
  option.globalScale = new GlobalScale([], chart as any);
  option.getTheme = () => ThemeManager.getCurrentTheme();
  option.region = (chart?.getAllRegions?.()?.[0] ?? new TestRegion({})) as IRegion;
  option.onError = msg => {
    console.log(msg);
  };
  return option;
}

export function componentOption(opt: Partial<IModelOption> = {}, chart: TestChart): IComponentOption {
  const option = modelOption(opt) as IComponentOption;
  option.getTheme = () => ThemeManager.getCurrentTheme();
  // 区域
  option.getRegionsInIndex = chart.getRegionsInIndex.bind(chart);
  option.getRegionsInIds = chart.getRegionsInIds.bind(chart);
  option.getRegionsInUserIdOrIndex = chart.getRegionsInUserIdOrIndex.bind(chart);
  // series
  option.getSeriesInIndex = chart.getSeriesInIndex.bind(chart);
  option.getSeriesInIds = chart.getSeriesInIds.bind(chart);
  option.getSeriesInUserIdOrIndex = chart.getSeriesInUserIdOrIndex.bind(chart);
  // component
  option.getComponentByIndex = chart.getComponentByIndex.bind(chart);
  option.getComponentsByKey = chart.getComponentsByKey.bind(chart);

  return option;
}

// 用于 mark 单测的上下文
export const markContext: any = {
  addSignal: (key: string, v: any) => {
    console.log('addSignal');
  },
  updateSignal: (key: string, v: any) => {
    console.log('updateSignal');
  },
  expressionFunction: (key: string, f: (...args: any) => any) => {
    console.log('expressionFunction');
  },
  // 编译对象 应当由外部提供
  getCompiler: (type: string, key: string, opt: any) => {
    return getTestCompiler();
  },
  globalScale: {},
  model: {
    getOption: () => seriesOption({})
  }
};
