import type { TooltipContentProperty } from './common';
import type { ITooltipShapeActual, ITooltipShapePattern } from './shape';

export interface IToolTipLinePattern extends ITooltipShapePattern {
  /** 该 pattern 属于哪个系列id（用户不需要设置） */
  seriesId?: number;
  /** tooltip key 值内容 */
  key?: TooltipContentProperty<string>;
  /** tooltip value 值内容 */
  value?: TooltipContentProperty<string>;
  /** 该行是否可见 */
  visible?: TooltipContentProperty<boolean>;
  /** key 列是否适应内容 */
  isKeyAdaptive?: TooltipContentProperty<boolean>;
}

export interface IToolTipLineActual extends ITooltipShapeActual {
  /** tooltip key 值内容 */
  key?: string;
  /** tooltip value 值内容 */
  value?: string;
  /** 该行是否可见 */
  visible?: boolean;
  /** key 列是否适应内容 */
  isKeyAdaptive?: boolean;
}
