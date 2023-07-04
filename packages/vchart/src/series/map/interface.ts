import type { IPathMarkSpec, ITextMarkSpec } from '../../typings/visual';
import type { IMarkSpec, IMarkTheme, ISeriesSpec } from '../../typings/spec/common';
import type { IAnimationSpec } from '../../animation/spec';
import type { ThemeType } from '../../theme';

type LineMarks = 'area';

export interface IMapSeriesSpec extends ISeriesSpec, IAnimationSpec<LineMarks, 'fadeIn'> {
  /**
   *  系列类型
   */
  type: 'map';
  /**
   *  地图数据源
   */
  map: string;
  /**
   *  名称维度
   */
  nameField: string;
  /**
   *  值维度
   */
  valueField: string;
  /**
   * 名称映射字段
   * @default 'name'
   */
  nameProperty?: string;
  /**
   *  名称映射表
   */
  nameMap?: { [key: string]: string };
  /**
   *  图元配置
   */
  area?: IMarkSpec<Omit<IPathMarkSpec, 'smoothScale'>>;

  /** 默认填充颜色 */
  defaultFillColor?: string;

  /** 标签配置 */
  label?: IMarkSpec<ITextMarkSpec> & { offset?: number; position?: string };
}

export interface IMapSeriesTheme extends ThemeType<IMapSeriesSpec> {
  defaultFillColor?: string;
  label?: Partial<IMarkTheme<ITextMarkSpec> & { offset?: number; position?: string }>;
  area?: Partial<IMarkTheme<Omit<IPathMarkSpec, 'smoothScale'>>>;
}
