import type { ITooltipHandlerOptions } from './interface';

export const TOOLTIP_CONTAINER_EL_CLASS_NAME = 'vchart-tooltip-container';
export const TOOLTIP_EMPTY_STRING = '';

export const DEFAULT_OPTIONS: ITooltipHandlerOptions = {
  /**
   * X offset.
   */
  offsetX: 10,

  /**
   * Y offset.
   */
  offsetY: 10
};
export const DEFAULT_TOOLTIP_Z_INDEX = '99999999999999';
