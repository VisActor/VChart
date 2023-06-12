import type { IMarkSpec, IMarkTheme } from '../../typings/spec';
import type { IArcMarkSpec, IPathMarkSpec, IProgressArcMarkSpec, IRectMarkSpec } from '../../typings/visual';
import type { IProgressLikeSeriesSpec, IProgressLikeSeriesTheme } from '../polar/progress-like/interface';
import type { IAnimationSpec } from '../../animation/spec';
import type { ProgressLikeAppearPreset } from '../polar/progress-like';
import type { SeriesMarkNameEnum } from '../interface';

export type GaugePointerMarks = 'pointer' | 'pin' | 'pinBackground';

export interface IGaugePointerSeriesSpec
  extends IProgressLikeSeriesSpec,
    IAnimationSpec<GaugePointerMarks, ProgressLikeAppearPreset> {
  type: 'gaugePointer';

  /** 数值字段（可影响指针角度） */
  valueField: string | string[];

  /** 半径字段（可影响指针长度，GaugePointerSeries 没有 categoryField） */
  radiusField: string;

  /** 图钉前景样式 */
  [SeriesMarkNameEnum.pin]?: IMarkSpec<IPathMarkSpec> & PinMarkSpec;
  /** 图钉背景样式 */
  [SeriesMarkNameEnum.pinBackground]?: IMarkSpec<IPathMarkSpec> & PinMarkSpec;
  /** 指针样式 */
  [SeriesMarkNameEnum.pointer]?: IMarkSpec<IPathMarkSpec | IRectMarkSpec> & PointerMarkSpec;
}

export type PointerMarkSpec = {
  type: 'path' | 'rect';

  /** 指针宽度比例（0~1） */
  width?: number;
  /** 指针长度比例（0~1）（为空则挂载 radius） */
  height?: number;
  /** 指针靠近圆心的一端离圆心的距离 */
  innerPadding?: number;
  /** 指针靠近边缘的一端离边缘的距离 */
  outerPadding?: number;

  /** 中心点坐标（0~1） */
  center?: [number, number];
};

export type PinMarkSpec = {
  /** 宽度 */
  width?: number;
  /** 高度 */
  height?: number;
};

export interface IGaugePointerSeriesTheme extends IProgressLikeSeriesTheme {
  /** 图钉前景样式 */
  [SeriesMarkNameEnum.pin]?: Partial<IMarkTheme<IPathMarkSpec> & PinMarkSpec>;
  /** 图钉背景样式 */
  [SeriesMarkNameEnum.pinBackground]?: Partial<IMarkTheme<IPathMarkSpec> & PinMarkSpec>;
  /** 指针样式 */
  [SeriesMarkNameEnum.pointer]?: Partial<IMarkTheme<IPathMarkSpec | IRectMarkSpec> & PointerMarkSpec>;
}

export type GaugeMarks = 'segment' | 'track';

export interface IGaugeSeriesSpec
  extends IProgressLikeSeriesSpec,
    IAnimationSpec<GaugeMarks, ProgressLikeAppearPreset> {
  type: 'gauge';

  /** 扇区间隔角度 */
  padAngle?: number;

  /** 扇区样式 */
  [SeriesMarkNameEnum.segment]?: IMarkSpec<IProgressArcMarkSpec>;
  /** 背景样式 */
  [SeriesMarkNameEnum.track]?: IMarkSpec<IArcMarkSpec>;
}

export interface IGaugeSeriesTheme extends IProgressLikeSeriesTheme {
  /** 扇区间隔角度 */
  padAngle?: number;

  /** 扇区样式 */
  [SeriesMarkNameEnum.segment]?: Partial<IMarkTheme<IProgressArcMarkSpec>>;
  /** 背景样式 */
  [SeriesMarkNameEnum.track]?: Partial<IMarkTheme<IArcMarkSpec>>;
}
