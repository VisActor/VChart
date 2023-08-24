import type { IModelSpec } from '../../model/interface';
import type { ConvertToMarkStyleSpec, ITextMarkSpec } from '../../typings/visual';
import type { IComponent } from '../interface';

export interface IIndicatorItemSpec {
  /**
   * 是否显示当前项
   * @default true
   */
  visible?: boolean;
  /**
   * 文字内容字段
   * 优先级高于样式中 text 配置
   */
  field?: string;
  /**
   * title.space: title 和 content 之间的间距
   * contentItem.space: content 之间的间距
   * 兼容gap
   */
  space?: number;
  /**
   * 是否自适应文字空间进行缩略
   * @default false
   */
  autoLimit?: boolean;
  /**
   * 是否自适应文字空间缩放文字大小
   * @default false
   */
  autoFit?: boolean;
  /**
   * 自适应文字宽度与可用空间的比例
   * @default 0.5
   */
  fitPercent?: number;
  /**
   * 文字样式
   */
  style?: Omit<ConvertToMarkStyleSpec<ITextMarkSpec>, 'visible'>;
}

export type IIndicator = IComponent;

export interface IIndicatorSpec extends IModelSpec {
  /**
   * 是否显示指标卡组件
   * @default true
   */
  visible?: boolean;
  /**
   * 保持指标卡内容显示 / 交互后才显示
   * @default true
   */
  fixed?: boolean;
  /**
   * 交互触发类型
   * @default 'select'
   */
  trigger?: 'hover' | 'select' | 'none';
  /**
   * 指标卡文字间隔
   * @deparated 已弃用，请使用 title.space 或者 content.space
   * @default 0
   */
  gap?: number;
  /**
   * 指标卡 x 方向偏移
   * @default 0
   */
  offsetX?: number;
  /**
   * 指标卡 y 方向偏移
   * @default 0
   */
  offsetY?: number;
  /**
   * 指标卡宽度占内容区域的最大比值（从0到1）
   */
  limitRatio?: number;
  /**
   * 指标卡标题文字配置
   */
  title?: IIndicatorItemSpec;
  /**
   * 指标卡内容文字配置
   */
  content?: IIndicatorItemSpec[] | IIndicatorItemSpec;
  /**
   * 组件关联的 region index
   */
  regionIndex?: number | number[];
  /**
   * 组件关联的 region id
   */
  regionId?: number | string | (number | string)[];
}

export interface IIndicatorItemTheme extends IIndicatorItemSpec {
  style?: Omit<ITextMarkSpec, 'visible'>;
}

export interface IIndicatorTheme extends IIndicatorSpec {
  /**
   * 指标卡标题文字配置
   */
  title?: IIndicatorItemTheme;
  /**
   * 指标卡内容文字配置
   */
  content?: IIndicatorItemTheme;
}
