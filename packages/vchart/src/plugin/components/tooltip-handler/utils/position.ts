import type { TooltipFixedPosition } from '../../../../typings/tooltip/position';
import { isFunction, isNumber, isValid } from '@visactor/vutils';

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

export type TooltipHorizontalPositionType = 'left' | 'right' | 'middle';
export type TooltipVerticalPositionType = 'top' | 'bottom' | 'middle';

export const positionType: Record<TooltipFixedPosition, [TooltipHorizontalPositionType, TooltipVerticalPositionType]> =
  {
    left: ['left', 'middle'],
    right: ['right', 'middle'],
    inside: ['middle', 'middle'],
    top: ['middle', 'top'],
    lt: ['left', 'top'],
    tl: ['left', 'top'],
    rt: ['right', 'top'],
    tr: ['right', 'top'],
    bottom: ['middle', 'bottom'],
    bl: ['left', 'bottom'],
    lb: ['left', 'bottom'],
    br: ['right', 'bottom'],
    rb: ['right', 'bottom']
  };

export const getHorizontalPositionType = (
  position: TooltipFixedPosition,
  defaultCase?: TooltipHorizontalPositionType
): TooltipHorizontalPositionType => positionType[position]?.[0] ?? defaultCase;

export const getVerticalPositionType = (
  position: TooltipFixedPosition,
  defaultCase?: TooltipVerticalPositionType
): TooltipVerticalPositionType => positionType[position]?.[1] ?? defaultCase;
