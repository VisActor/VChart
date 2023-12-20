import type { IAnimationSpec } from '../../animation/spec';
import type { IArcMarkSpec, ITextMarkSpec, IMarkSpec, IMarkTheme, ISeriesSpec } from '../../typings';
import type { SeriesMarkNameEnum } from '../interface/type';
import type { IPolarSeriesTheme } from '../polar/interface';
import type { CirclePackingAppearPreset, CirclePackingMark } from './animation';

export interface ICirclePackingSeriesSpec
  extends ISeriesSpec,
    IAnimationSpec<CirclePackingMark, CirclePackingAppearPreset> {
  type: 'circlePacking';

  /**
   * 分类字段
   * @requires
   */
  categoryField: string;

  /**
   * 权重字段
   * @requires
   */
  valueField: string;

  /**
   * 层内边距
   * @default 5
   * @description 支持传入数组, 单独控制某一层的内边距
   */
  layoutPadding?: number | number[];

  /**
   * 标签配置
   * @description 对所有层生效
   */
  [SeriesMarkNameEnum.label]?: IMarkSpec<ITextMarkSpec>;

  /**
   * 图元配置
   */
  [SeriesMarkNameEnum.circlePacking]?: IMarkSpec<IArcMarkSpec>;

  /**
   * 下钻配置
   * @default false
   * @description 下钻功能开关
   */
  drill?: boolean;
  /**
   * 钻取字段的field
   * @default DEFAULT_DATA_KEY
   * @description 通过API进行钻取, 需要此配置项.
   */
  drillField?: string;
}

export interface ICirclePackingSeriesTheme extends Omit<IPolarSeriesTheme, 'label'> {
  layoutPadding?: number | number[];
  [SeriesMarkNameEnum.label]?: IMarkTheme<ITextMarkSpec>;
  [SeriesMarkNameEnum.circlePacking]?: IMarkTheme<IArcMarkSpec>;
}
