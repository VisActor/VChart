/* eslint-disable max-depth */
import type { IChart } from '../../../../chart/interface';
import type { IDimensionData, IDimensionInfo } from '../interface';
import { isNil, array, isValid, isValidNumber } from '@visactor/vutils';
import type { AxisComponent } from '../../../../component/axis/base-axis';
import type { CoordinateType } from '../../../../typings';
import { isDiscrete } from '@visactor/vscale';
import type { ICartesianLinearAxisSpec } from '../../../../component';
import type { Maybe } from '@visactor/vutils';
import type { ILayoutPoint } from '../../../../layout/interface';

const isInBound = (pos: ILayoutPoint, min: ILayoutPoint, max: ILayoutPoint): boolean =>
  pos.x >= min.x && pos.x <= max.x && pos.y >= min.y && pos.y <= max.y;

export const isInRegionBound = (chart: IChart, axis: AxisComponent, pos: ILayoutPoint) => {
  const regionList = chart.getRegionsInIds(array(axis.layout.layoutBindRegionID));
  return regionList?.some(region => {
    const rect = region.getLayoutRect();
    const startPoint = region.getLayoutStartPoint();
    return isInBound(
      pos,
      { x: startPoint.x, y: startPoint.y },
      { x: rect.width + startPoint.x, y: rect.height + startPoint.y }
    );
  });
};

export const isSameDimensionInfo = (a?: IDimensionInfo, b?: IDimensionInfo): boolean => {
  if (a === b) {
    return true;
  }
  if (isNil(a) || isNil(b)) {
    return false;
  }
  if (a.value !== b.value) {
    return false;
  }
  if (a.axis?.id !== b.axis?.id) {
    return false;
  }
  return true;
};

/** 给定维度项的值，获取对应维度数据 */
export const getDimensionData = (
  value: any,
  axis: AxisComponent,
  coordinate: CoordinateType,
  getDimensionField: (series: any) => string | string[]
): IDimensionData[] => {
  const scale = axis.getScale();
  const isDiscreteAxis = isDiscrete(scale.type);

  const data: IDimensionData[] = [];
  const regions = axis.getRegions(); // TODO: 直接从轴里取系列
  for (const region of regions) {
    const seriesList = region.getSeries();
    for (const series of seriesList) {
      if (series.coordinate === coordinate) {
        const dimensionField = array(getDimensionField(series));
        const viewData = series.getViewData()?.latestData;
        if (dimensionField && viewData) {
          if (isDiscreteAxis) {
            data.push({
              series,
              datum: viewData.filter(
                (datum: any) => datum[dimensionField[0]]?.toString() === value?.toString() // 获取该维度项所对应的数据
              )
            });
          } else {
            // 连续轴
            if (isValid(dimensionField[1])) {
              // 直方图情况，根据范围取 datum
              data.push({
                series,
                datum: viewData.filter((datum: any) => {
                  if (datum[dimensionField[0]]?.toString() === value?.toString()) {
                    return true;
                  }
                  return (
                    isValid(datum[dimensionField[0]]) &&
                    isValid(datum[dimensionField[1]]) &&
                    value >= datum[dimensionField[0]] &&
                    value < datum[dimensionField[1]]
                  );
                })
              });
            } else {
              // 散点图情况，依据轴上的配置判断
              const range = (axis.getSpec() as ICartesianLinearAxisSpec).tooltipFilterRange;
              const rangeArr = (isValidNumber(range) ? [-range, range] : range) as Maybe<[number, number]>;
              let datums: any[] = [];
              if (rangeArr) {
                // 根据范围取 datum
                viewData.forEach((datum: any) => {
                  if (isValid(datum[dimensionField[0]])) {
                    const delta = datum[dimensionField[0]] - value;
                    if (delta >= rangeArr[0] && delta <= rangeArr[1]) {
                      datums.push(datum);
                    }
                  }
                });
              } else {
                // 根据最近距离取 datum
                let minDelta = Infinity;
                let deltaSign = 0;
                viewData.forEach((datum: any) => {
                  if (isValid(datum[dimensionField[0]])) {
                    const delta = Math.abs(datum[dimensionField[0]] - value);
                    const sign = Math.sign(datum[dimensionField[0]] - value);
                    if (delta < minDelta) {
                      minDelta = delta;
                      datums = [datum];
                      deltaSign = sign;
                    } else if (delta === minDelta && sign === deltaSign) {
                      datums.push(datum);
                    }
                  }
                });
              }
              data.push({
                series,
                datum: datums
              });
            }
          }
        }
      }
    }
  }
  return data;
};
