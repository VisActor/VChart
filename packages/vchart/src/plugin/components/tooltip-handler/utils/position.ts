import type { IAxis } from '../../../../component/axis';
import type { AxisCurrentValueMap, CrossHairStateByField } from '../../../../component/crosshair';

import { layoutByValue, layoutCrosshair } from '../../../../component/crosshair/utils/cartesian';
import type { IDimensionData } from '../../../../event';
import type { ICartesianSeries } from '../../../../series';
import { Direction, type ILayoutPoint } from '../../../../typings';
import type {
  IFixedTooltipPositionPattern,
  IGlobalTooltipPositionPattern,
  TooltipFixedPosition
} from '../../../../typings/tooltip/position';
import { isFunction, isNumber, isObject, isValid } from '@visactor/vutils';

export const getActualTooltipPositionValue = (
  position: number | ((event: MouseEvent) => number) | null | undefined,
  event: MouseEvent
): number => {
  let result: number;
  if (isValid(position)) {
    if (isNumber(position)) {
      result = position as number;
    } else if (isFunction(position)) {
      //  这里额外判断下是否合法
      const tooltipPosition = (position as (event: MouseEvent) => number)(event);

      if (isNumber(tooltipPosition)) {
        result = tooltipPosition;
      }
    }
  }
  return result;
};

// 'left' | 'centerLeft' | 'center'  | 'centerRight' |  'right'
// 'top' | 'centerTop' | 'center' | 'centerBottom' | 'bottom'
export type TooltipPositionType = -2 | -1 | 0 | 1 | 2;

/** position 对齐方式在 x、y 分量下的分解 */
export const positionType: Record<TooltipFixedPosition, [TooltipPositionType, TooltipPositionType]> = {
  left: [-2, 0],
  right: [2, 0],
  top: [0, -2],
  lt: [-2, -2],
  tl: [-2, -2],
  rt: [2, -2],
  tr: [2, -2],
  bottom: [0, 2],
  bl: [-2, 2],
  lb: [-2, 2],
  br: [2, 2],
  rb: [2, 2],
  inside: [0, 0], // 旧版兼容
  center: [0, 0],
  centerBottom: [0, 1],
  centerTop: [0, -1],
  centerLeft: [-1, 0],
  centerRight: [1, 0]
};

export const getPositionType = (
  position: TooltipFixedPosition,
  dim: 'x' | 'y',
  defaultCase: TooltipPositionType = 2
): TooltipPositionType => positionType[position]?.[dim === 'x' ? 0 : 1] ?? defaultCase;

export const getCartesianCrosshairRect = (dimensionData: IDimensionData, layoutStartPoint: ILayoutPoint) => {
  const currValueX: AxisCurrentValueMap = new Map();
  const currValueY: AxisCurrentValueMap = new Map();
  const { series, datum } = dimensionData;
  const isHorizontal = (series as ICartesianSeries).direction === Direction.horizontal;
  const axisHelper = isHorizontal
    ? (series as ICartesianSeries).getYAxisHelper()
    : (series as ICartesianSeries).getXAxisHelper();
  const axisId = axisHelper.getAxisId();
  const axis = series
    .getChart()
    .getComponentsByKey('axes')
    .find(axis => axis.id === axisId) as IAxis;

  if (!axis) {
    return undefined;
  }
  (isHorizontal ? currValueY : currValueX).set(axis.getSpecIndex(), {
    datum: series.getDatumPositionValues(datum[0], series.getDimensionField())?.[0],
    axis
  });

  const state: CrossHairStateByField = {
    xField: {
      coordKey: 'x',
      anotherAxisKey: 'y',
      currentValue: currValueX,
      attributes: {
        visible: !!currValueX.size,
        type: 'rect'
      }
    },
    yField: {
      coordKey: 'y',
      anotherAxisKey: 'x',
      currentValue: currValueY,
      attributes: {
        visible: !!currValueY.size,
        type: 'rect'
      }
    }
  };

  layoutByValue(state, series as ICartesianSeries, layoutStartPoint);

  if (state.xField.cacheInfo) {
    return layoutCrosshair(state.xField);
  }
  if (state.yField.cacheInfo) {
    return layoutCrosshair(state.yField);
  }
  return undefined;
};

export const isGlobalTooltipPositionPattern = (obj: any): obj is IGlobalTooltipPositionPattern => {
  return (
    isObject(obj) &&
    (isValid((obj as IGlobalTooltipPositionPattern).left) ||
      isValid((obj as IGlobalTooltipPositionPattern).right) ||
      isValid((obj as IGlobalTooltipPositionPattern).top) ||
      isValid((obj as IGlobalTooltipPositionPattern).bottom))
  );
};

export const isFixedTooltipPositionPattern = (obj: any): obj is IFixedTooltipPositionPattern => {
  return (
    isObject(obj) &&
    (isValid((obj as IFixedTooltipPositionPattern).x) || isValid((obj as IFixedTooltipPositionPattern).y))
  );
};
