import { array, isFunction, isNil } from '@visactor/vutils';
import type { IChartSpec, IVChart } from '../../core';
// eslint-disable-next-line no-duplicate-imports
import { Factory } from '../../core';
import type {
  IMediaQueryAction,
  IMediaQueryActionFilterResult,
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
import { includeSpec } from '@visactor/vutils-extension';

/** 执行元素过滤器 */
export const executeMediaQueryActionFilter = <T extends Record<string, unknown>>(
  filterType: MediaQueryActionFilterType = 'chart',
  filter: MediaQueryActionFilter<T> | undefined,
  action: IMediaQueryAction<T>,
  query: IMediaQueryCondition,
  chartSpec: any,
  globalInstance: IVChart
): IMediaQueryActionFilterResult => {
  const result = executeMediaQueryActionFilterType<T>(filterType, chartSpec, globalInstance);
  return {
    ...result,
    modelInfo: result.modelInfo.filter(info => {
      if (isNil(filter)) {
        return true;
      }
      if (isFunction(filter)) {
        return filter(info, action, query);
      }
      // spec 模糊匹配
      return includeSpec(info.spec, filter);
    })
  };
};

/** 执行元素过滤器的 filterType 部分的筛选 */
export const executeMediaQueryActionFilterType = <T extends Record<string, unknown>>(
  filterType: MediaQueryActionFilterType = 'chart',
  chartSpec: any,
  globalInstance: IVChart
): IMediaQueryActionFilterResult<T> => {
  const result: IMediaQueryActionFilterResult<T> = {
    modelInfo: []
  };

  const chart = globalInstance.getChart();
  const chartSpecInfo = globalInstance.getSpecInfo();

  if (filterType === 'chart') {
    result.isChart = true;
    result.modelInfo.push({
      model: chart,
      spec: chartSpec,
      type: 'chart'
    });
  } else if (filterType === 'region') {
    result.modelType = 'region';
    result.specKey = 'region';
    if (chart) {
      chart.getAllRegions().forEach(region => {
        result.modelInfo.push({
          model: region,
          spec: region.getSpec(),
          specPath: region.getSpecPath(),
          specIndex: region.getSpecIndex(),
          type: 'region'
        });
      });
    } else {
      chartSpec.region?.forEach((regionSpec: T, i: number) => {
        result.modelInfo.push({
          spec: regionSpec,
          specPath: ['region', i],
          specIndex: i,
          type: 'region'
        });
      });
    }
  } else if (filterType === 'series') {
    result.modelType = 'series';
    result.specKey = 'series';
    if (chart) {
      chart.getAllSeries().forEach(series => {
        result.modelInfo.push({
          model: series,
          spec: series.getSpec(),
          specPath: series.getSpecPath(),
          specIndex: series.getSpecIndex(),
          type: series.type
        });
      });
    } else {
      chartSpec.series?.forEach((seriesSpec: T, i: number) => {
        result.modelInfo.push({
          spec: seriesSpec,
          specPath: ['series', i],
          specIndex: i,
          type: seriesSpec.type as string
        });
      });
    }
  } else if (Object.values(SeriesTypeEnum).includes(filterType as SeriesTypeEnum)) {
    result.modelType = 'series';
    result.specKey = 'series';
    result.type = filterType as SeriesTypeEnum;
    if (chart) {
      chart.getAllSeries().forEach(series => {
        if (series.type === filterType) {
          result.modelInfo.push({
            model: series,
            spec: series.getSpec(),
            specPath: series.getSpecPath(),
            specIndex: series.getSpecIndex(),
            type: filterType
          });
        }
      });
    } else {
      chartSpec.series?.forEach((seriesSpec: T, i: number) => {
        if (seriesSpec.type === filterType) {
          result.modelInfo.push({
            spec: seriesSpec,
            specPath: ['series', i],
            specIndex: i,
            type: filterType
          });
        }
      });
    }
  } else if (Object.values(SimplifiedComponentTypeEnum).includes(filterType as SimplifiedComponentTypeEnum)) {
    result.modelType = 'component';
    let componentTypes: ComponentTypeEnum[] | undefined;
    switch (filterType) {
      case SimplifiedComponentTypeEnum.axis:
        componentTypes = axisComponentTypes;
        result.specKey = 'axes';
        break;
      case SimplifiedComponentTypeEnum.legend:
        componentTypes = legendComponentTypes;
        result.specKey = 'legends';
        break;
      case SimplifiedComponentTypeEnum.crosshair:
        componentTypes = crosshairComponentTypes;
        result.specKey = 'crosshair';
    }
    if (chart) {
      chart.getAllComponents().forEach(component => {
        if (componentTypes?.includes(component.type as ComponentTypeEnum)) {
          result.modelInfo.push({
            model: component,
            spec: component.getSpec(),
            specPath: component.getSpecPath(),
            specIndex: component.getSpecIndex(),
            type: component.type
          });
        }
      });
    } else {
      const { specKey } = result;
      const infoList = array(chartSpecInfo[specKey] ?? []);
      array(chartSpec[specKey] ?? []).forEach((componentSpec, i) => {
        const specInfo = infoList[i];
        if (componentTypes?.includes(specInfo.type as ComponentTypeEnum)) {
          result.modelInfo.push({
            ...specInfo,
            spec: componentSpec
          });
        }
      });
    }
  } else if (Object.values(ComponentTypeEnum).includes(filterType as ComponentTypeEnum)) {
    result.modelType = 'component';
    result.type = filterType as ComponentTypeEnum;
    result.specKey = Factory.getComponentInKey(filterType)?.specKey as keyof IChartSpec;

    if (chart) {
      chart.getAllComponents().forEach(component => {
        if (component.type === filterType) {
          result.modelInfo.push({
            model: component,
            spec: component.getSpec(),
            specPath: component.getSpecPath(),
            specIndex: component.getSpecIndex(),
            type: filterType
          });
        }
      });
    } else {
      const { specKey } = result;
      const infoList = array(chartSpecInfo[specKey] ?? []);
      array(chartSpec[specKey] ?? [])?.forEach((componentSpec, i) => {
        const specInfo = infoList[i];
        if (specInfo.type === filterType) {
          result.modelInfo.push({
            ...specInfo,
            spec: componentSpec
          });
        }
      });
    }
  }

  return result;
};
