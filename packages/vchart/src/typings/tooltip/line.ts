import type { TooltipContentProperty } from './common';
import type { ITooltipLabelActual, ITooltipLabelPattern } from './label';
import type { ITooltipShapeActual, ITooltipShapePattern } from './shape';
import type { TooltipRichTextAttrs } from '@visactor/vrender-components';

export interface IToolTipLinePattern extends ITooltipShapePattern, ITooltipLabelPattern {
  /** tooltip key 值内容 */
  key?: TooltipContentProperty<string>;
  /** tooltip value 值内容
   *  支持富文本配置
   *   - type 文本类型：text, rich, html
   *   - text 文本内容：string | string[] | number | number[] | IRichTextCharacter[];
   */
  value?: TooltipContentProperty<string | TooltipRichTextAttrs>;
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
  value?: string | TooltipRichTextAttrs;
  /** 该行是否可见 */
  visible?: boolean;
  /** key 列是否适应内容 */
  isKeyAdaptive?: boolean;
  /**
   * 该行行间距
   * @since 1.4.0
   */
  spaceRow?: number;
  /**
   * 该行对应的原始数据
   * @since 1.5.1
   */
  datum?: any;
}
