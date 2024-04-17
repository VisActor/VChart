import type { IArcMarkSpec, IDataValues, IPathMarkSpec } from '../../typings';
import type { IMarkSpec, IMarkTheme, ISeriesSpec } from '../../typings/spec';
import type { IVennCircleDatum, IVennOverlapDatum } from '@visactor/vgrammar-venn';
import type { IAnimationSpec } from '../../animation/spec';
import type { VennAppearPreset, VennMark } from './animation';
import type { SeriesMarkNameEnum } from '../interface/type';
import type { ILabelSpec } from '../../component';
import type { DataView } from '@visactor/vdataset';

export interface IVennDataValues extends Omit<IDataValues, 'values'> {
  values: Array<IVennCircleDatum | IVennOverlapDatum>;
}

export type VennData = DataView | IVennDataValues;

export interface IVennSeriesSpec extends Omit<ISeriesSpec, 'data'>, IAnimationSpec<VennMark, VennAppearPreset> {
  type: 'venn';
  /**
   * 文本字段
   */
  categoryField?: string;
  /**
   * 集合 id 字段
   */
  setField: string | string[];
  /**
   * 权重字段
   */
  valueField: string;
  /**
   * 数据
   */
  data: VennData;
  /**
   * 标签配置
   */
  [SeriesMarkNameEnum.label]?: Omit<ILabelSpec, 'position'>;

  /**
   * 圆形图元配置
   */
  [SeriesMarkNameEnum.circle]?: IMarkSpec<IArcMarkSpec>;

  /**
   * 重叠部分图元配置
   */
  [SeriesMarkNameEnum.overlap]?: IMarkSpec<IPathMarkSpec>;
}

export interface IVennSeriesTheme {
  /**
   * 标签配置
   */
  [SeriesMarkNameEnum.label]?: Omit<ILabelSpec, 'position'>;

  /**
   * 圆形图元配置
   */
  [SeriesMarkNameEnum.circle]?: Partial<IMarkTheme<IArcMarkSpec>>;

  /**
   * 重叠部分图元配置
   */
  [SeriesMarkNameEnum.overlap]?: Partial<IMarkTheme<IPathMarkSpec>>;
}
