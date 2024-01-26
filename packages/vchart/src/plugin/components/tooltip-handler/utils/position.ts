import { TooltipFixedPosition } from '../../../../typings/tooltip/position';
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
    [TooltipFixedPosition.left]: ['left', 'middle'],
    [TooltipFixedPosition.right]: ['right', 'middle'],
    [TooltipFixedPosition.inside]: ['middle', 'middle'],
    [TooltipFixedPosition.top]: ['middle', 'top'],
    [TooltipFixedPosition.lt]: ['left', 'top'],
    [TooltipFixedPosition.tl]: ['left', 'top'],
    [TooltipFixedPosition.rt]: ['right', 'top'],
    [TooltipFixedPosition.tr]: ['right', 'top'],
    [TooltipFixedPosition.bottom]: ['middle', 'bottom'],
    [TooltipFixedPosition.bl]: ['left', 'bottom'],
    [TooltipFixedPosition.lb]: ['left', 'bottom'],
    [TooltipFixedPosition.br]: ['right', 'bottom'],
    [TooltipFixedPosition.rb]: ['right', 'bottom']
  };

export const getHorizontalPositionType = (
  position: TooltipFixedPosition,
  defaultCase?: TooltipHorizontalPositionType
): TooltipHorizontalPositionType => positionType[position]?.[0] ?? defaultCase;

export const getVerticalPositionType = (
  position: TooltipFixedPosition,
  defaultCase?: TooltipVerticalPositionType
): TooltipVerticalPositionType => positionType[position]?.[1] ?? defaultCase;
