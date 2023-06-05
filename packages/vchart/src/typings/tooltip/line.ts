import type { TooltipContentCallback } from './common';
import type { ITooltipShapeActual, ITooltipShapePattern } from './shape';

export interface IToolTipLinePattern extends ITooltipShapePattern {
  /** 该 pattern 属于哪个系列id（用户不需要设置） */
  seriesId?: number;
  /** tooltip key 值内容或回调 */
  key?: string | TooltipContentCallback;
  /** tooltip value 值内容或回调 */
  value?: string | TooltipContentCallback;
  /** 该行是否可见 */
  visible?: boolean;
}

export interface IToolTipLineActual extends ITooltipShapeActual {
  /** tooltip key 值内容 */
  key?: string;
  /** tooltip value 值内容 */
  value?: string;
  /** 该行是否可见 */
  visible?: boolean;
}
