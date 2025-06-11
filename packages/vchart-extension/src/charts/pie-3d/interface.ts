import type {
  IArcLabelSpec,
  IChartExtendsSeriesSpec,
  IChartSpec,
  IIndicatorSpec,
  IMarkTheme,
  IPieSeriesSpec,
  IPolarSeriesTheme,
  SeriesMarkNameEnum
} from '@visactor/vchart';
import type { SeriesMark3dNameEnum } from '../3d/enum';
import type { IArc3dMarkSpec } from '../3d/interface';

export interface IPie3dChartSpec extends IChartSpec, IChartExtendsSeriesSpec<IPie3dSeriesSpec> {
  type: 'pie3d';
  /** 饼图指标卡 */
  indicator?: IIndicatorSpec | IIndicatorSpec[];
}

export type IPie3dSeriesSpec = {
  type: 'pie3d';
  // 饼图整体绕x轴的旋转角度
  angle3d?: number;
} & Omit<IPieSeriesSpec, 'type'>;

export interface IPie3dSeriesTheme extends IPolarSeriesTheme {
  [SeriesMark3dNameEnum.pie3d]?: Partial<IMarkTheme<IArc3dMarkSpec>>;
  /** 标签配置 */
  [SeriesMarkNameEnum.label]?: IArcLabelSpec;
  /**
   * 内标签配置
   * @since 1.5.1
   */
  innerLabel?: IArcLabelSpec;
  /**
   * 外标签配置
   * @since 1.5.1
   */
  outerLabel?: IArcLabelSpec;
}
