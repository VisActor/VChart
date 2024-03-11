import type { DimensionEventParams } from '../../../event/events/dimension/interface';
import type { DimensionTooltipInfo, MarkTooltipInfo } from '../processor/interface';
import type { Datum, IShowTooltipOption } from '../../../typings';
import type { IComponent } from '../../interface';

export type TooltipHandlerParams = DimensionEventParams & {
  /** 本次触发的 tooltip 是否只改变了位置 */
  changePositionOnly?: boolean;
  /** tooltip 组件实例 */
  tooltip: ITooltip;
};

export interface ITooltipActiveTypeAsKeys<T, K> {
  mark: T;
  dimension: K;
}

export type TotalMouseEventData = {
  tooltipInfo: Partial<ITooltipActiveTypeAsKeys<MarkTooltipInfo, DimensionTooltipInfo>>;
  ignore: Partial<ITooltipActiveTypeAsKeys<boolean, boolean>>;
};

export const enum TooltipResult {
  /** tooltip 显示成功 */
  success = 0,
  /** tooltip 未成功显示 */
  failed = 1
}

export interface ITooltip extends IComponent {
  getVisible: () => boolean;
  showTooltip: (datum: Datum, options: IShowTooltipOption) => void;
}
