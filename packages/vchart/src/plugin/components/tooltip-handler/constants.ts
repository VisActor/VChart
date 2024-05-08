import { escapeHTML } from './utils/common';

export const TOOLTIP_CONTAINER_EL_CLASS_NAME = 'vchart-tooltip-container';
export const TOOLTIP_EMPTY_STRING = '';

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
