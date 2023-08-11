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
}

type LabelStateStyle<T> = {
  hover?: T;
  hover_reverse?: T;
  selected?: T;
  selected_reverse?: T;
};

export type ITotalLabelSpec = Pick<
  ILabelSpec,
  'visible' | 'formatMethod' | 'interactive' | 'offset' | 'style' | 'state'
>;

export interface ITotalLabelTheme
  extends Pick<ILabelSpec, 'visible' | 'interactive' | 'offset' | 'overlap' | 'smartInvert' | 'animation'> {
  style?: ITextMarkSpec;
}
