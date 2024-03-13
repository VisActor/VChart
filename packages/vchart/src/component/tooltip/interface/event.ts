import type { TooltipActiveType, TooltipData } from '../../../typings';
import type { TooltipHandlerParams } from './common';

export type TooltipEventParams = TooltipHandlerParams & {
  /** 触发的 tooltip 类型 */
  activeType?: TooltipActiveType;
  /** tooltip 数据 */
  tooltipData?: TooltipData;
};
