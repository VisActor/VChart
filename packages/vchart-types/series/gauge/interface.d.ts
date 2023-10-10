import type { IMarkSpec, IMarkTheme } from '../../typings/spec';
import type { IArcMarkSpec, IPathMarkSpec, IProgressArcMarkSpec, IRectMarkSpec } from '../../typings/visual';
import type { IProgressLikeSeriesSpec, IProgressLikeSeriesTheme } from '../polar/progress-like/interface';
import type { IAnimationSpec } from '../../animation/spec';
import type { ProgressLikeAppearPreset } from '../polar/progress-like';
import type { SeriesMarkNameEnum } from '../interface/type';
import type { ILabelSpec } from '../../component/label/interface';
export type GaugePointerMarks = 'pointer' | 'pin' | 'pinBackground';
export interface IGaugePointerSeriesSpec
  extends IProgressLikeSeriesSpec,
    IAnimationSpec<GaugePointerMarks, ProgressLikeAppearPreset> {
  type: 'gaugePointer';
  valueField: string | string[];
  radiusField: string;
  [SeriesMarkNameEnum.pin]?: IMarkSpec<IPathMarkSpec> & PinMarkSpec;
  [SeriesMarkNameEnum.pinBackground]?: IMarkSpec<IPathMarkSpec> & PinMarkSpec;
  [SeriesMarkNameEnum.pointer]?: IMarkSpec<IPathMarkSpec | IRectMarkSpec> & PointerMarkSpec;
}
export type PointerMarkSpec = {
  type: 'path' | 'rect';
  width?: number;
  height?: number;
  innerPadding?: number;
  outerPadding?: number;
  center?: [number, number];
};
export type PinMarkSpec = {
  width?: number;
  height?: number;
};
export interface IGaugePointerSeriesTheme extends IProgressLikeSeriesTheme {
  [SeriesMarkNameEnum.pin]?: Partial<IMarkTheme<IPathMarkSpec> & PinMarkSpec>;
  [SeriesMarkNameEnum.pinBackground]?: Partial<IMarkTheme<IPathMarkSpec> & PinMarkSpec>;
  [SeriesMarkNameEnum.pointer]?: Partial<IMarkTheme<IPathMarkSpec | IRectMarkSpec> & PointerMarkSpec>;
}
export type GaugeMarks = 'segment' | 'track';
export interface IGaugeSeriesSpec
  extends IProgressLikeSeriesSpec,
    IAnimationSpec<GaugeMarks, ProgressLikeAppearPreset> {
  type: 'gauge';
  padAngle?: number;
  [SeriesMarkNameEnum.segment]?: IMarkSpec<IProgressArcMarkSpec>;
  [SeriesMarkNameEnum.track]?: IMarkSpec<IArcMarkSpec>;
  [SeriesMarkNameEnum.label]?: IGaugeLabelSpec;
}
export interface IGaugeSeriesTheme extends IProgressLikeSeriesTheme {
  padAngle?: number;
  [SeriesMarkNameEnum.segment]?: Partial<IMarkTheme<IProgressArcMarkSpec>>;
  [SeriesMarkNameEnum.track]?: Partial<IMarkTheme<IArcMarkSpec>>;
  [SeriesMarkNameEnum.label]?: IGaugeLabelSpec;
}
export type IGaugeLabelSpec = ILabelSpec;
