import { PREFIX } from '../../constant';
import type { ITooltipLineActual } from '../../typings';

export class TooltipHandlerType {
  static dom = `${PREFIX}_TOOLTIP_HANDLER_DOM`; // 模拟 enum
  static canvas = `${PREFIX}_TOOLTIP_HANDLER_CANVAS`;
}

export const TOOLTIP_EL_CLASS_NAME = 'vchart-tooltip-element';

export const TOOLTIP_MAX_LINE_COUNT = 20;

export const TOOLTIP_OTHERS_LINE = {
  // TODO: i18n
  key: '其他',
  value: '...'
} as ITooltipLineActual;
