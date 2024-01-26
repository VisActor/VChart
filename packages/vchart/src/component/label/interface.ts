import type { BaseLabelAttrs } from '@visactor/vrender-components';
import type { ConvertToMarkStyleSpec, Datum, ITextMarkSpec } from '../../typings';
import type { IComponentSpec } from '../base/interface';
import type { IRichTextCharacter } from '@visactor/vrender-core';
import type { ILabelMark } from '../../mark/label';
import type { ISeries } from '../../series';

export interface ILabelFormatMethodContext {
  series?: ISeries;
}

export interface ILabelSpec extends IComponentSpec {
  /** 默认不显示标签 */
  visible?: boolean;
  /** 是否支持交互。@default false */
  interactive?: boolean;
  // 文本类型：text, rich, html (区分于图元类型)
  textType?: string;
  /** 格式化函数
   *  支持返回值为富文本内容, 如textConfig, html
   */
  formatMethod?: (
    text: string | string[],
    datum?: Datum,
    ctx?: ILabelFormatMethodContext
  ) => string | string[] | IRichTextCharacter[];
  /** 字符串模版
   *  用{}包裹变量名的字符串模版, 变量名取自数据属性值
   *  在饼图中支持配置百分比, {_percent_}
   *  eg: 'type={type},value={value},percent={_percent_}'
   *  @since 1.7.0
   */
  formatter?: string;
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
  /** 自定义标签数据筛选和排序
   * @since 1.3.0
   */
  dataFilter?: BaseLabelAttrs['dataFilter'];
  /** 自定义标签布局函数。
   * @description 当配置了 customLayoutFunc 后，默认布局和防重叠逻辑将不再生效。（overlap/position/offset不生效）
   * @since 1.3.0
   */
  customLayoutFunc?: BaseLabelAttrs['customLayoutFunc'];
  /** 自定义标签躲避函数
   * @description 当配置了 customOverlapFunc 后，会根据 position 和 offset 进行初始布局。配置的防重叠逻辑(overlap)不生效。
   * @since 1.3.0
   */
  customOverlapFunc?: BaseLabelAttrs['customOverlapFunc'];
  /** 标签布局 */
  labelLayout?: 'series' | 'region';
  /** 中心点偏移距离 */
  centerOffset?: number;
  /** 是否支持3D */
  support3d?: boolean;
  /**
   * 是否同步数据图元的状态变化
   * @default false
   * @since 1.9.0
   */
  syncState?: boolean;
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

// 内部处理转换后的标签配置
export type TransformedLabelSpec = ILabelSpec & {
  getStyleHandler: (series: ISeries) => (mark?: ILabelMark) => void;
};
