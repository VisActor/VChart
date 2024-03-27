import type { DimensionEventParams } from '../../../event/events/dimension/interface';
import type { DimensionTooltipInfo, MarkTooltipInfo } from '../processor/interface';
import type { Datum, IShowTooltipOption, ITooltipActual } from '../../../typings';
import type { IComponent } from '../../interface';
import type { ITooltipSpec } from './spec';

export type TooltipHandlerParams = DimensionEventParams & {
  /** 本次触发的 tooltip 是否只改变了位置 */
  changePositionOnly?: boolean;
  /** tooltip 组件实例 */
  tooltip: ITooltip;
  /** 本次触发的 tooltip 对应的最终 spec（可能经过了一些补全） */
  tooltipSpec?: ITooltipSpec;
  /** 本次触发的 tooltip 的显示数据 */
  tooltipActual?: ITooltipActual;
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
