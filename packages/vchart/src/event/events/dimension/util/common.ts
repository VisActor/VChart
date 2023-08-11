import type { ILayoutPoint } from '../../../../model/interface';
import type { IChart } from '../../../../chart/interface';
import type { IDimensionData, IDimensionInfo } from '../interface';
import { isNil, array, isValid } from '../../../../util';
import type { AxisComponent } from '../../../../component/axis/base-axis';
import type { CoordinateType } from '../../../../typings';
import { isDiscrete } from '@visactor/vscale';

const isInBound = (pos: ILayoutPoint, min: ILayoutPoint, max: ILayoutPoint): boolean =>
  pos.x >= min.x && pos.x <= max.x && pos.y >= min.y && pos.y <= max.y;

export const isInRegionBound = (chart: IChart, axis: AxisComponent, pos: ILayoutPoint) => {
  const regionList = chart.getRegionsInIds(array(axis.layoutBindRegionID));
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
            if (isValid(dimensionField[1])) {
              // 根据范围取 datum
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
              // 根据最近距离取 datum
              let minDelta = Infinity;
              let minDatums: any[] = [];
              let deltaSign = 0;
              viewData.forEach((datum: any) => {
                if (isValid(datum[dimensionField[0]])) {
                  const delta = Math.abs(datum[dimensionField[0]] - value);
                  const sign = Math.sign(datum[dimensionField[0]] - value);
                  if (delta < minDelta) {
                    minDelta = delta;
                    minDatums = [datum];
                    deltaSign = sign;
                  } else if (delta === minDelta && sign === deltaSign) {
                    minDatums.push(datum);
                  }
                }
              });
              data.push({
                series,
                datum: minDatums
              });
            }
          }
        }
      }
    }
  }
  return data;
};
