import type { IChart } from '../../../../chart/interface';
import type { ILayoutPoint } from '../../../../model/interface';
import type { IDimensionInfo } from '../interface';
import { isDiscrete } from '@visactor/vscale';
import { getDimensionData, isInRegionBound } from './common';
import type { CartesianAxis } from '../../../../component/axis/cartesian';
import type { ICartesianSeries } from '../../../../series/interface';
import { isNil } from '@visactor/vutils';
import type { AxisComponent } from '../../../../component/axis/base-axis';

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
    const getDimensionField = (series: ICartesianSeries) => series.fieldX[0];

    xAxisList.forEach(axis => {
      const xScale = axis.getScale();

      // 限定为离散轴
      if (xScale && isDiscrete(xScale.type)) {
        const xValue = x - axis.getLayoutStartPoint().x;

        // 判断是否在 range 范围内
        if ((xValue - xScale.range()[0]) * (xValue - xScale.range()[1]) > 0) {
          return;
        }

        const value = xScale.invert(xValue);
        if (isNil(value)) {
          return;
        }
        const domain = xScale.domain();
        let index: number | undefined = domain.findIndex((v: any) => v?.toString() === value.toString());
        if (index < 0) {
          index = undefined;
        }

        const data = getDimensionData(value, axis, 'cartesian', getDimensionField);
        targetAxisInfo.push({ index, value, axis, data });
      }
    });
  }
  if (yAxisList) {
    const getDimensionField = (series: ICartesianSeries) => series.fieldY[0];

    yAxisList.forEach(axis => {
      const yScale = axis.getScale();

      // 限定为离散轴
      if (yScale && isDiscrete(yScale.type)) {
        const yValue = y - axis.getLayoutStartPoint().y;

        // 判断是否在 range 范围内
        if ((yValue - yScale.range()[0]) * (yValue - yScale.range()[1]) > 0) {
          return;
        }

        const value = yScale.invert(yValue);
        if (isNil(value)) {
          return;
        }
        const domain = yScale.domain();
        let index: number | undefined = domain.findIndex((v: any) => v?.toString() === value.toString());
        if (index < 0) {
          index = undefined;
        }

        const data = getDimensionData(value, axis, 'cartesian', getDimensionField);
        targetAxisInfo.push({ index, value, axis, data });
      }
    });
  }
  if (!targetAxisInfo.length) {
    return null;
  }
  return targetAxisInfo;
};
