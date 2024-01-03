import { PREFIX } from '../../../constant';
import type { IToolTipLineActual } from '../../../typings';
import { escapeHTML } from './utils/common';

export const TOOLTIP_EL_CLASS_NAME = 'vchart-tooltip-element';
export const TOOLTIP_CONTAINER_EL_CLASS_NAME = 'vchart-tooltip-container';
export const TOOLTIP_MAX_LINE_COUNT = 20;
export const TOOLTIP_EMPTY_STRING = '';

export const TOOLTIP_OTHERS_LINE = {
  // TODO: i18n
  key: '其他',
  value: '...'
} as IToolTipLineActual;

export const DEFAULT_OPTIONS = {
  /**
   * X offset.
   */
  offsetX: 10,

  /**
   * Y offset.
   */
  offsetY: 10,

  /**
   * HTML sanitizer function that removes dangerous HTML to prevent XSS.
   *
   * This should be a function from string to string. You may replace it with a formatter such as a markdown formatter.
   */
  sanitize: escapeHTML
};

// FIXME: 命名规范
export type Options = typeof DEFAULT_OPTIONS;

/** 内置 handler 类型 */
export class TooltipHandlerType {
  static dom = `${PREFIX}_TOOLTIP_HANDLER_DOM`; // 模拟 enum
  static canvas = `${PREFIX}_TOOLTIP_HANDLER_CANVAS`;
}
