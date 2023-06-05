import { isFunction, isNumber, isValid } from '../../../../util';

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
