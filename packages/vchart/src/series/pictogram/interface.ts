import type { IPathMarkSpec } from '../../typings/visual';
import type { IMarkSpec, IMarkTheme, ISeriesSpec } from '../../typings/spec/common';
import type { IAnimationSpec } from '../../animation/spec';

export interface IPictogramSeriesSpec extends ISeriesSpec, IAnimationSpec<'pictogram', 'fadeIn'> {
  /**
   *  系列类型
   */
  type: 'pictogram';
  /**
   *  svg 数据源
   */
  svg: string;
  /**
   *  名称维度
   */
  nameField?: string;
  /**
   *  值维度
   */
  valueField?: string;
  /**
   *  图元配置
   */
  pictogram?: IMarkSpec<Omit<IPathMarkSpec, 'smoothScale'>>;

  /** 默认填充颜色 */
  defaultFillColor?: string;
}

export interface IPictogramThemeSpec {
  defaultFillColor?: string;
  pictogram?: Partial<IMarkTheme<Omit<IPathMarkSpec, 'smoothScale'>>>;
}
