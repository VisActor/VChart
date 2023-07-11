import type { IChart } from '../../../../chart/interface';
import type { ILayoutPoint } from '../../../../model/interface';
import type { IDimensionInfo } from '../interface';
import { isDiscrete } from '@visactor/vscale';
import { getDimensionData, isInRegionBound } from './common';
import type { CartesianAxis } from '../../../../component/axis/cartesian';
import type { ICartesianSeries } from '../../../../series/interface';
import { isNil } from '@visactor/vutils';
import type { AxisComponent } from '../../../../component/axis/base-axis';
import { isXAxis } from '../../../../component/axis/cartesian/util';

const getAxis = (chart: IChart, type: 'x' | 'y', pos: ILayoutPoint): CartesianAxis[] | null => {
  const axesComponents = chart
    .getAllComponents()
    .filter(
      c =>
        c.specKey === 'axes' &&
        (type === 'x'
          ? (c as AxisComponent).orient === 'bottom' || (c as AxisComponent).orient === 'top'
          : (c as AxisComponent).orient === 'left' || (c as AxisComponent).orient === 'right') &&
        isInRegionBound(chart, c as AxisComponent, pos)
    ) as CartesianAxis[];
  if (!axesComponents.length) {
    return null;
  }
  return axesComponents;
};

const getFirstSeries = (chart: IChart) => {
  const regions = chart.getRegionsInIndex();
  for (let i = 0; i < regions.length; i++) {
    const r = regions[i];
    const series = r.getSeries();
    for (let j = 0; j < series.length; j++) {
      const s = series[j];
      if (s.coordinate === 'cartesian') {
        return s as ICartesianSeries;
      }
    }
  }
  return null;
};

const XAxisGetDimensionField = (series: ICartesianSeries) => series.fieldX[0];
const YAxisGetDimensionField = (series: ICartesianSeries) => series.fieldY[0];

export const getCartesianDimensionInfo = (chart: IChart | undefined, pos: ILayoutPoint): IDimensionInfo[] | null => {
  if (!chart) {
    return null;
  }
  const series = getFirstSeries(chart);
  if (!series) {
    return null;
  }

  const { x, y } = pos;
  const xAxisList = getAxis(chart, 'x', pos);
  const yAxisList = getAxis(chart, 'y', pos);
  const targetAxisInfo: IDimensionInfo[] = [];

  if (xAxisList) {
    xAxisList.forEach(axis => {
      const info = getDiscreteAxisDimensionInfo(axis, x, 'x', XAxisGetDimensionField);
      info && targetAxisInfo.push(info);
    });
  }
  if (yAxisList) {
    yAxisList.forEach(axis => {
      const info = getDiscreteAxisDimensionInfo(axis, y, 'y', YAxisGetDimensionField);
      info && targetAxisInfo.push(info);
    });
  }
  if (!targetAxisInfo.length) {
    return null;
  }
  return targetAxisInfo;
};

export const getDiscreteAxisDimensionInfo = (
  axis: CartesianAxis,
  posValue: number,
  posKey: 'x' | 'y',
  getDimensionField: (series: ICartesianSeries) => string
): IDimensionInfo | null => {
  const scale = axis.getScale();
  const scalePos = posValue - axis.getLayoutStartPoint()[posKey];
  // 判断是否在 range 范围内
  if ((scalePos - scale.range()[0]) * (scalePos - scale.range()[1]) > 0) {
    return null;
  }

  const value = scale.invert(scalePos);
  return getDimensionInfoInAxis(axis, value, getDimensionField);
};

export const getDimensionInfoInAxis = (
  axis: CartesianAxis,
  value: any,
  getDimensionField?: (series: ICartesianSeries) => string
): IDimensionInfo | null => {
  const scale = axis.getScale();

  // 限定为离散轴
  if (!scale || !isDiscrete(scale.type)) {
    return null;
  }
  if (isNil(value)) {
    return null;
  }
  const domain = scale.domain();
  let index: number | undefined = domain.findIndex((v: any) => v?.toString() === value.toString());
  if (index < 0) {
    index = undefined;
  }

  const data = getDimensionData(
    value,
    axis,
    'cartesian',
    getDimensionField ?? (isXAxis(axis.orient) ? XAxisGetDimensionField : YAxisGetDimensionField)
  );
  return { index, value, axis, data };
};
