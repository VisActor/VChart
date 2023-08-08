import type { BaseLabelAttrs } from '@visactor/vrender-components';
import type { ConvertToMarkStyleSpec, ITextMarkSpec } from '../../typings';

export interface ILabelSpec {
  /** 默认不显示标签 */
  visible?: boolean;
  /** 是否支持交互。@default false */
  interactive?: boolean;
  /** 格式化函数 */
  formatMethod?: (text: string | string[], datum?: any) => string | string[];
  /** 标签与其对应数据图元的间距 */
  offset?: number;
  /** 标签位置 */
  position?: string;
  /** 标签样式配置 */
  style?: ConvertToMarkStyleSpec<ITextMarkSpec>;
  /** 交互样式配置 */
  state?: LabelStateStyle<Partial<ITextMarkSpec>>;
  /** 标签防重叠配置 */
  overlap?: BaseLabelAttrs['overlap'];
  /** 标签智能反色配置 */
  smartInvert?: BaseLabelAttrs['smartInvert'];
  /** 动画配置 */
  animation?: BaseLabelAttrs['animation'];
  /** 自定义标签数据筛选和排序 */
  dataFilter?: BaseLabelAttrs['dataFilter'];
  /** 自定义标签布局函数。
   *  @description 当配置了 customLayoutFunc 后，默认布局和防重叠逻辑将不再生效。（overlap/position/offset不生效）
   */
  customLayoutFunc?: BaseLabelAttrs['customLayoutFunc'];
  /** 自定义标签躲避函数
   * @description 当配置了 customOverlapFunc 后，会根据 position 和 offset 进行初始布局。配置的防重叠逻辑(overlap)不生效。
   */
  customOverlapFunc?: BaseLabelAttrs['customOverlapFunc'];
}

type LabelStateStyle<T> = {
  hover?: T;
  hover_reverse?: T;
  selected?: T;
  selected_reverse?: T;
};
