import type { IGraphic } from '@visactor/vrender-core';
import type { IPadding, IOrientType, StringOrNumber } from '../../typings';
import type { IPathMarkSpec, IRectMarkSpec, ISymbolMarkSpec, ITextMarkSpec } from '../../typings/visual';
import type { IModelSpec } from '../../model/interface';

export type LabelPosition = IOrientType | 'outer';

export interface IMapLabelSpec extends IMapLabelTheme, Pick<IModelSpec, 'id'> {
  /** 关联的系列 id */
  seriesId: StringOrNumber;
  /** 名称文本的数据字段 */
  nameField?: string;
  /** 数值文本的数据字段 */
  valueField?: string;
  /**
   * 交互触发类型
   * @default 'none'
   */
  trigger?: 'hover' | 'click' | 'none';
}

export type IMapLabelNodes = 'nameLabel' | 'valueLabel' | 'icon' | 'labelBackground' | 'container';

export type MapLabelSceneNodeMap = Partial<Record<IMapLabelNodes, IGraphic>>;

export interface IMapLabelTheme {
  /** 是否显示，默认 false */
  visible?: boolean;
  /** 标签非 outer 位置下与标记点的间距 */
  offset?: number;
  /**
   * icon/label之间的距离
   */
  space?: number;
  /** 标签位置 */
  position?: LabelPosition;
  /** 名称文本样式设置 */
  nameLabel?: {
    visible?: boolean;
    style?: ITextMarkSpec;
  };
  /** 数值文本样式设置 */
  valueLabel?: {
    visible?: boolean;
    style?: ITextMarkSpec;
  };
  /** 图标样式设置 */
  icon?: {
    visible?: boolean;
    style?: ISymbolMarkSpec;
  };
  /** 背景样式设置 */
  background?: {
    visible?: boolean;
    padding?: IPadding;
    style?: IRectMarkSpec;
  };
  /** 引导线样式设置 */
  leader?: {
    visible?: boolean;
    style?: IPathMarkSpec;
  };
}
