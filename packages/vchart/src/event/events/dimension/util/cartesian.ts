import type { IChart } from '../../../../chart/interface';
import type { IDimensionInfo } from '../interface';
import { isDiscrete } from '@visactor/vscale';
import { getDimensionData, getAxis } from './common';
import type { CartesianAxis } from '../../../../component/axis/cartesian';
import type { ICartesianSeries } from '../../../../series/interface';
import { isNil } from '@visactor/vutils';
import { isXAxis, isYAxis } from '../../../../component/axis/cartesian/util/common';
import { Direction } from '../../../../typings/space';
import type { ILayoutPoint } from '../../../../typings/layout';
import { getFirstSeries } from '../../../../util/model';

const discreteXAxisGetDimensionField = (series: ICartesianSeries) => series.fieldX[0];
const discreteYAxisGetDimensionField = (series: ICartesianSeries) => series.fieldY[0];
const continuousXAxisGetDimensionField = (series: ICartesianSeries) => [series.fieldX[0], series.fieldX2];
const continuousYAxisGetDimensionField = (series: ICartesianSeries) => [series.fieldY[0], series.fieldY2];

export const getCartesianDimensionInfo = (chart: IChart | undefined, pos: ILayoutPoint): IDimensionInfo[] | null => {
  if (!chart) {
    return null;
  }
  const series = getFirstSeries(chart.getRegionsInIndex(), 'cartesian');
  if (!series) {
    return null;
  }

  const { x, y } = pos;
  const xAxisList = getAxis(chart, (cmp: CartesianAxis) => isXAxis(cmp.getOrient()), pos) ?? [];
  const yAxisList = getAxis(chart, (cmp: CartesianAxis) => isYAxis(cmp.getOrient()), pos) ?? [];

  const bandAxisSet: Set<CartesianAxis> = new Set();
  const linearAxisSet: Set<CartesianAxis> = new Set();
  [xAxisList, yAxisList].forEach(axisList =>
    axisList.forEach(axis => {
      const isDiscreteAxis = isDiscrete(axis.getScale().type);
      if (isDiscreteAxis) {
        bandAxisSet.add(axis);
      } else {
        linearAxisSet.add(axis);
      }
    })
  );

  const targetAxisInfo: IDimensionInfo[] = [];

  const addAxisDimensionInfo = (orient: 'x' | 'y', isDiscrete: boolean) => {
    (orient === 'x' ? xAxisList : yAxisList).forEach(axis => {
      if ((isDiscrete ? bandAxisSet : linearAxisSet).has(axis)) {
        const info = getDimensionInfoByPosition(
          axis,
          orient === 'x' ? x : y,
          orient,
          orient === 'x'
            ? isDiscrete
              ? discreteXAxisGetDimensionField
              : continuousXAxisGetDimensionField
            : isDiscrete
            ? discreteYAxisGetDimensionField
            : continuousYAxisGetDimensionField
        );
        info && targetAxisInfo.push(info);
      }
    });
  };

  // 优先筛选 band 轴，其次按照 direction 判断
  if (chart.getSpec().direction === Direction.horizontal) {
    addAxisDimensionInfo('y', bandAxisSet.size > 0);
    if (targetAxisInfo.length === 0) {
      addAxisDimensionInfo('x', bandAxisSet.size > 0);
    }
  } else {
    addAxisDimensionInfo('x', bandAxisSet.size > 0);
    if (targetAxisInfo.length === 0) {
      addAxisDimensionInfo('y', bandAxisSet.size > 0);
    }
  }

  if (!targetAxisInfo.length) {
    return null;
  }
  return targetAxisInfo;
};

export const getDimensionInfoByPosition = (
  axis: CartesianAxis,
  posValue: number,
  posKey: 'x' | 'y',
  getDimensionField: (series: ICartesianSeries) => string | string[]
): IDimensionInfo | null => {
  const scale = axis.getScale();
  const scalePos = posValue - axis.getLayoutStartPoint()[posKey];
  // 判断是否在 range 范围内
  if ((scalePos - scale.range()[0]) * (scalePos - scale.range()[1]) > 0) {
    return null;
  }

  const value = scale.invert(scalePos);
  return getDimensionInfoByValue(axis, value, getDimensionField);
};

export const getDimensionInfoByValue = (
  axis: CartesianAxis,
  value: any,
  getDimensionField?: (series: ICartesianSeries) => string | string[]
): IDimensionInfo | null => {
  const scale = axis.getScale();

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
    getDimensionField ?? (isXAxis(axis.getOrient()) ? discreteXAxisGetDimensionField : discreteYAxisGetDimensionField)
  );
  return { index, value, axis, data };
};
