import type { TooltipContentProperty } from './common';
import type { ITooltipLabelActual, ITooltipLabelPattern } from './label';
import type { ITooltipShapeActual, ITooltipShapePattern } from './shape';

export interface IToolTipLinePattern extends ITooltipShapePattern, ITooltipLabelPattern {
  /** tooltip key 值内容 */
  key?: TooltipContentProperty<string>;
  /** tooltip value 值内容 */
  value?: TooltipContentProperty<string>;
  /** 该行是否可见 */
  visible?: TooltipContentProperty<boolean>;
  /** key 列是否适应内容 */
  isKeyAdaptive?: TooltipContentProperty<boolean>;
  /**
   * 该行行间距
   * @since 1.4.0
   */
  spaceRow?: TooltipContentProperty<number>;
}

export interface IToolTipLineActual extends ITooltipShapeActual, ITooltipLabelActual {
  /** tooltip key 值内容 */
  key?: string;
  /** tooltip value 值内容 */
  value?: string;
  /** 该行是否可见 */
  visible?: boolean;
  /** key 列是否适应内容 */
  isKeyAdaptive?: boolean;
  /**
   * 该行行间距
   * @since 1.4.0
   */
  spaceRow?: number;
}
