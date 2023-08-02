import type { TooltipActiveType, TooltipData } from '../../../typings';
import type { IComponent } from '../../interface/common';
import type { TooltipHandlerParams } from './common';

export type TooltipEventParams = TooltipHandlerParams & {
  /** 触发的 tooltip 类型 */
  activeType?: TooltipActiveType;
  /** tooltip 数据 */
  tooltipData?: TooltipData;
  /** tooltip 组件实例 */
  tooltip: IComponent;
};
