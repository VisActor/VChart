import { isFunction, isNil } from '@visactor/vutils';
import type { IChart } from '../../chart/interface';
import type { IChartSpec, IVChart } from '../../core';
// eslint-disable-next-line no-duplicate-imports
import { Factory } from '../../core';
import type { IModel } from '../../model/interface';
import type {
  IFilterInfoForAppend,
  IFilteredModelInfo,
  IMediaQueryAction,
  IMediaQueryCondition,
  MediaQueryActionFilter,
  MediaQueryActionFilterType
} from '../interface';
import { SeriesTypeEnum } from '../../series/interface';
import {
  ComponentTypeEnum,
  SimplifiedComponentTypeEnum,
  axisComponentTypes,
  crosshairComponentTypes,
  legendComponentTypes
} from '../../component/interface';
import { includeSpec } from './common';

/** 执行元素过滤器 */
export const executeMediaQueryActionFilter = <T extends Record<string, unknown>>(
  filterType: MediaQueryActionFilterType = 'chart',
  filter: MediaQueryActionFilter<T> | undefined,
  action: IMediaQueryAction<T>,
  query: IMediaQueryCondition,
  globalInstance: IVChart
): {
  filteredModels: (IModel | IChart)[];
  filterInfoForAppend: IFilterInfoForAppend;
} => {
  const { filteredModels, filterInfoForAppend } = executeMediaQueryActionFilterType<T>(filterType, globalInstance);
  return {
    filteredModels: filteredModels
      .filter(({ model, spec }) => {
        if (isNil(filter)) {
          return true;
        }
        if (isFunction(filter)) {
          return filter(model, action, query);
        }
        // spec 模糊匹配
        return includeSpec(spec, filter);
      })
      .map(({ model }) => model),
    filterInfoForAppend
  };
};

/** 执行元素过滤器的 filterType 部分的筛选 */
export const executeMediaQueryActionFilterType = <T extends Record<string, unknown>>(
  filterType: MediaQueryActionFilterType = 'chart',
  globalInstance: IVChart
): {
  filteredModels: IFilteredModelInfo<T>[];
  filterInfoForAppend: IFilterInfoForAppend;
} => {
  const filteredModels: IFilteredModelInfo<T>[] = [];
  const filterInfoForAppend: IFilterInfoForAppend = {};

  const chart = globalInstance.getChart();
  if (filterType === 'chart') {
    filterInfoForAppend.isChart = true;

    filteredModels.push({
      model: chart,
      spec: chart.getSpec()
    });
  } else if (filterType === 'region') {
    filterInfoForAppend.modelType = 'region';
    filterInfoForAppend.specKey = 'region';

    chart.getAllRegions().forEach(region => {
      filteredModels.push({
        model: region,
        spec: region.getSpec()
      });
    });
  } else if (filterType === 'series') {
    filterInfoForAppend.modelType = 'series';
    filterInfoForAppend.specKey = 'series';

    chart.getAllSeries().forEach(series => {
      filteredModels.push({
        model: series,
        spec: series.getSpec()
      });
    });
  } else if (Object.values(SeriesTypeEnum).includes(filterType as SeriesTypeEnum)) {
    filterInfoForAppend.modelType = 'series';
    filterInfoForAppend.specKey = 'series';
    filterInfoForAppend.type = filterType as SeriesTypeEnum;

    chart.getAllSeries().forEach(series => {
      if (series.type === filterType) {
        filteredModels.push({
          model: series,
          spec: series.getSpec()
        });
      }
    });
  } else if (Object.values(SimplifiedComponentTypeEnum).includes(filterType as SimplifiedComponentTypeEnum)) {
    filterInfoForAppend.modelType = 'component';

    let componentTypes: ComponentTypeEnum[] | undefined;
    switch (filterType) {
      case SimplifiedComponentTypeEnum.axis:
        componentTypes = axisComponentTypes;
        filterInfoForAppend.specKey = 'axes';
        break;
      case SimplifiedComponentTypeEnum.legend:
        componentTypes = legendComponentTypes;
        filterInfoForAppend.specKey = 'legends';
        break;
      case SimplifiedComponentTypeEnum.crosshair:
        componentTypes = crosshairComponentTypes;
        filterInfoForAppend.specKey = 'crosshair';
    }
    chart.getAllComponents().forEach(component => {
      if (componentTypes?.includes(component.type as ComponentTypeEnum)) {
        filteredModels.push({
          model: component,
          spec: component.getSpec()
        });
      }
    });
  } else if (Object.values(ComponentTypeEnum).includes(filterType as ComponentTypeEnum)) {
    filterInfoForAppend.modelType = 'component';
    filterInfoForAppend.type = filterType as ComponentTypeEnum;
    filterInfoForAppend.specKey = Factory.getComponentInKey(filterType)?.specKey as keyof IChartSpec;

    chart.getAllComponents().forEach(component => {
      if (component.type === filterType) {
        filteredModels.push({
          model: component,
          spec: component.getSpec()
        });
      }
    });
  }

  return { filteredModels, filterInfoForAppend };
};
