import type { IPathMarkSpec, ITextMarkSpec } from '../../typings/visual';
import type { IMarkSpec, IMarkTheme, ISeriesSpec } from '../../typings/spec/common';
import type { IAnimationSpec } from '../../animation/spec';
import { ILabelSpec } from '../../component';

export interface IPictogramSeriesSpec extends ISeriesSpec, IAnimationSpec<'pictogram', 'fadeIn'> {
  /**
   *  系列类型
   */
  type: 'pictogram';
  /**
   *  地图数据源
   */
  map: string;
  /**
   *  名称维度
   */
  nameField?: string;
  /**
   *  值维度
   */
  valueField?: string;
  /**
   * 名称映射字段
   * @default 'name'
   */
  nameProperty?: string;
  /**
   * 中心坐标映射字段
   * @default  undefined
   * @since 1.5.1
   */
  centroidProperty?: string;
  /**
   *  名称映射表
   */
  nameMap?: { [key: string]: string };
  /**
   *  图元配置
   */
  pictogram?: IMarkSpec<Omit<IPathMarkSpec, 'smoothScale'>>;

  /** 默认填充颜色 */
  defaultFillColor?: string;

  /**
   * 是否显示数据中没有的地区名称
   * @default false
   * @since 1.10.3
   */
  showDefaultName?: boolean;
}

export interface IPictogramThemeSpec {
  defaultFillColor?: string;
  pictogram?: Partial<IMarkTheme<Omit<IPathMarkSpec, 'smoothScale'>>>;
}
