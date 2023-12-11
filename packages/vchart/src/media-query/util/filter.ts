import { array, isFunction, isNil } from '@visactor/vutils';
import type { IChart } from '../../chart/interface';
import type { IChartSpec, IRegionSpec, IVChart } from '../../core';
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
  chartSpec: any,
  globalInstance: IVChart
): {
  filteredModelInfo: IFilteredModelInfo<T>[];
  filterInfoForAppend: IFilterInfoForAppend;
} => {
  const { filteredModels, filterInfoForAppend } = executeMediaQueryActionFilterType<T>(
    filterType,
    chartSpec,
    globalInstance
  );
  return {
    filteredModelInfo: filteredModels.filter(({ model, spec }) => {
      if (isNil(filter)) {
        return true;
      }
      if (isFunction(filter)) {
        return filter(spec, model, action, query);
      }
      // spec 模糊匹配
      return includeSpec(spec, filter);
    }),
    filterInfoForAppend
  };
};

/** 执行元素过滤器的 filterType 部分的筛选 */
export const executeMediaQueryActionFilterType = <T extends Record<string, unknown>>(
  filterType: MediaQueryActionFilterType = 'chart',
  chartSpec: any,
  globalInstance: IVChart
): {
  filteredModels: IFilteredModelInfo<T>[];
  filterInfoForAppend: IFilterInfoForAppend;
} => {
  const filteredModels: IFilteredModelInfo<T>[] = [];
  const filterInfoForAppend: IFilterInfoForAppend = {};

  const chart = globalInstance.getChart();
  const chartSpecInfo = globalInstance.getSpecInfo();

  if (filterType === 'chart') {
    filterInfoForAppend.isChart = true;

    filteredModels.push({
      model: chart,
      spec: chartSpec
    });
  } else if (filterType === 'region') {
    filterInfoForAppend.modelType = 'region';
    filterInfoForAppend.specKey = 'region';

    if (chart) {
      chart.getAllRegions().forEach(region => {
        filteredModels.push({
          model: region,
          spec: region.getSpec(),
          specPath: region.getSpecPath()
        });
      });
    } else {
      chartSpec.region?.forEach((regionSpec: T, i: number) => {
        filteredModels.push({
          spec: regionSpec,
          specPath: ['region', i]
        });
      });
    }
  } else if (filterType === 'series') {
    filterInfoForAppend.modelType = 'series';
    filterInfoForAppend.specKey = 'series';

    if (chart) {
      chart.getAllSeries().forEach(series => {
        filteredModels.push({
          model: series,
          spec: series.getSpec(),
          specPath: series.getSpecPath()
        });
      });
    } else {
      chartSpec.series?.forEach((seriesSpec: T, i: number) => {
        filteredModels.push({
          spec: seriesSpec,
          specPath: ['series', i]
        });
      });
    }
  } else if (Object.values(SeriesTypeEnum).includes(filterType as SeriesTypeEnum)) {
    filterInfoForAppend.modelType = 'series';
    filterInfoForAppend.specKey = 'series';
    filterInfoForAppend.type = filterType as SeriesTypeEnum;

    if (chart) {
      chart.getAllSeries().forEach(series => {
        if (series.type === filterType) {
          filteredModels.push({
            model: series,
            spec: series.getSpec(),
            specPath: series.getSpecPath()
          });
        }
      });
    } else {
      chartSpec.series?.forEach((seriesSpec: T, i: number) => {
        if (seriesSpec.type === filterType) {
          filteredModels.push({
            spec: seriesSpec,
            specPath: ['series', i]
          });
        }
      });
    }
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
    if (chart) {
      chart.getAllComponents().forEach(component => {
        if (componentTypes?.includes(component.type as ComponentTypeEnum)) {
          filteredModels.push({
            model: component,
            spec: component.getSpec(),
            specPath: component.getSpecPath()
          });
        }
      });
    } else {
      array(chartSpec[filterInfoForAppend.specKey])?.forEach((componentSpec, i) => {
        const specInfo = array(chartSpecInfo[filterInfoForAppend.specKey])[i];
        if (componentTypes?.includes(specInfo.type as ComponentTypeEnum)) {
          filteredModels.push({
            spec: componentSpec,
            specPath: specInfo.specPath
          });
        }
      });
    }
  } else if (Object.values(ComponentTypeEnum).includes(filterType as ComponentTypeEnum)) {
    filterInfoForAppend.modelType = 'component';
    filterInfoForAppend.type = filterType as ComponentTypeEnum;
    filterInfoForAppend.specKey = Factory.getComponentInKey(filterType)?.specKey as keyof IChartSpec;

    if (chart) {
      chart.getAllComponents().forEach(component => {
        if (component.type === filterType) {
          filteredModels.push({
            model: component,
            spec: component.getSpec(),
            specPath: component.getSpecPath()
          });
        }
      });
    } else {
      array(chartSpec[filterInfoForAppend.specKey])?.forEach((componentSpec, i) => {
        const specInfo = array(chartSpecInfo[filterInfoForAppend.specKey])[i];
        if (specInfo.type === filterType) {
          filteredModels.push({
            spec: componentSpec,
            specPath: specInfo.specPath
          });
        }
      });
    }
  }

  return { filteredModels, filterInfoForAppend };
};
