import type { IAnimationSpec } from '../../animation/spec';
import type { IMarkProgressiveConfig } from '../../mark/interface';
import type { DirectionType, IBoxPlotMarkSpec, IOutlierMarkSpec, IMarkSpec, IMarkTheme } from '../../typings';
import type { ICartesianSeriesSpec, ICartesianSeriesTheme } from '../cartesian/interface';
import type { SeriesMarkNameEnum } from '../interface/type';

export interface IBoxPlotSeriesSpec
  extends Omit<ICartesianSeriesSpec, 'xField' | 'yField' | 'direction'>,
    // TODO: 补充动画类型 @chengda
    IAnimationSpec<string, string>,
    IMarkProgressiveConfig {
  /** 系列类型 */
  type: 'boxPlot';
  direction?: DirectionType;
  /**
   *x轴字段（direction=vertical时生效）
   */
  xField?: string | string[];
  /**
   *y轴字段（direction=horizontal时生效）
   */
  yField?: string | string[];
  /**
   *最小值字段
   */
  minField?: string;
  /**
   *最大值字段
   */
  maxField?: string;
  /**
   *q1字段
   */
  q1Field?: string;
  /**
   *中位数字段
   */
  medianField?: string;
  /**
   *q3字段
   */
  q3Field?: string;
  /**
   *异常值字段
   */
  /**
   * 图元配置
   */
  [SeriesMarkNameEnum.boxPlot]?: IMarkSpec<IBoxPlotMarkSpec>;
  /**
   * 异常值字段
   */
  outliersField?: string;
  /**
   * 异常值样式配置
   */
  outliersStyle?: IOutlierMarkSpec;
}

export interface IBoxPlotSeriesTheme extends ICartesianSeriesTheme {
  [SeriesMarkNameEnum.boxPlot]?: Partial<IMarkTheme<IBoxPlotMarkSpec>>;
}
