import type { ITooltipHandlerSpec } from '../../component/tooltip/interface';
import type { IDimensionData, IDimensionInfo } from '../../event/events/dimension/interface';

export interface ITooltipHandler extends ITooltipHandlerSpec {
  /** 可选，获取 tooltip 所在容器 */
  getTooltipContainer?: () => any;
  /** 可选，更新 tooltip spec 或主题后执行的回调 */
  reInit?: () => any;
  /** 可选，判断 tooltip 是否正在显示 */
  isTooltipShown?: () => boolean;
}

export type TooltipData = IDimensionInfo[] | IDimensionData[];

export type TooltipActiveType = 'mark' | 'dimension';
