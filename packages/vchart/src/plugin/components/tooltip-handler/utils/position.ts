import type { AxisCurrentValueMap } from '../../../../component/crosshair';
import type { IHair } from '../../../../component/crosshair/base';
import { LayoutType } from '../../../../component/crosshair/config';
import {
  layoutByValue,
  layoutHorizontalCrosshair,
  layoutVerticalCrosshair
} from '../../../../component/crosshair/utils/cartesian';
import type { IDimensionInfo } from '../../../../event';
import type { ICartesianSeries } from '../../../../series';
import type { ILayoutPoint } from '../../../../typings';
import type {
  IFixedTooltipPositionPattern,
  IGlobalTooltipPositionPattern,
  TooltipFixedPosition
} from '../../../../typings/tooltip/position';
import { isFunction, isNumber, isObject, isValid } from '@visactor/vutils';

export const getActualTooltipPositionValue = (
  position: number | ((event: MouseEvent) => number) | null | undefined,
  event: MouseEvent
) => {
  let result;
  if (isValid(position)) {
    if (isNumber(position)) {
      result = position;
    } else if (isFunction(position)) {
      //  这里额外判断下是否合法
      const tooltipPosition = position(event);

      if (isNumber(tooltipPosition)) {
        result = tooltipPosition;
      }
    }
  }
  return result;
};

export type TooltipHorizontalPositionType = 'left' | 'right' | 'middle' | 'middleLeft' | 'middleRight';
export type TooltipVerticalPositionType = 'top' | 'bottom' | 'middle' | 'middleTop' | 'middleBottom';

/** position 对齐方式在 x、y 分量下的分解 */
export const positionType: Record<TooltipFixedPosition, [TooltipHorizontalPositionType, TooltipVerticalPositionType]> =
  {
    left: ['left', 'middle'],
    right: ['right', 'middle'],
    top: ['middle', 'top'],
    lt: ['left', 'top'],
    tl: ['left', 'top'],
    rt: ['right', 'top'],
    tr: ['right', 'top'],
    bottom: ['middle', 'bottom'],
    bl: ['left', 'bottom'],
    lb: ['left', 'bottom'],
    br: ['right', 'bottom'],
    rb: ['right', 'bottom'],
    inside: ['middle', 'middle'], // 旧版兼容
    middle: ['middle', 'middle'],
    middleBottom: ['middle', 'middleBottom'],
    middleTop: ['middle', 'middleTop'],
    middleLeft: ['middleLeft', 'middle'],
    middleRight: ['middleRight', 'middle']
  };

export const getHorizontalPositionType = (
  position: TooltipFixedPosition,
  defaultCase?: TooltipHorizontalPositionType
): TooltipHorizontalPositionType => positionType[position]?.[0] ?? defaultCase;

export const getVerticalPositionType = (
  position: TooltipFixedPosition,
  defaultCase?: TooltipVerticalPositionType
): TooltipVerticalPositionType => positionType[position]?.[1] ?? defaultCase;

export const getCartesianCrosshairRect = (
  dimensionInfo: IDimensionInfo[],
  series: ICartesianSeries,
  layoutStartPoint: ILayoutPoint
) => {
  const currValueX: AxisCurrentValueMap = new Map();
  const currValueY: AxisCurrentValueMap = new Map();
  // 将 dimensionInfo 转换为 AxisCurrentValueMap
  dimensionInfo.forEach(({ axis, value }) => {
    if (['top', 'bottom'].includes(axis.getOrient())) {
      currValueX.set(axis.getSpecIndex(), {
        value,
        axis
      });
    } else {
      currValueY.set(axis.getSpecIndex(), {
        value,
        axis
      });
    }
  });

  const xHair: IHair = {
    visible: !!currValueX.size,
    type: 'rect'
  };
  const yHair: IHair = {
    visible: !!currValueY.size,
    type: 'rect'
  };

  const {
    x: crosshairInfoX,
    y: crosshairInfoY,
    offsetWidth,
    offsetHeight,
    bandWidth,
    bandHeight
  } = layoutByValue(LayoutType.ALL, series, layoutStartPoint, currValueX, currValueY, xHair, yHair);

  if (crosshairInfoX) {
    return layoutVerticalCrosshair(xHair, crosshairInfoX, bandWidth, offsetWidth);
  }
  if (crosshairInfoY) {
    return layoutHorizontalCrosshair(yHair, crosshairInfoY, bandHeight, offsetHeight);
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
