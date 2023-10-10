import type { IMarkSpec } from '../../typings/spec/common';
import type { ICartesianSeriesSpec, ICartesianSeriesTheme } from '../cartesian/interface';
import type { ISymbolMarkSpec, ILineMarkSpec } from '../../typings/visual';
import type { IAnimationSpec } from '../../animation/spec';
import type { LineAppearPreset } from './animation';
import type { ILineLikeSeriesTheme } from '../mixin/line-mixin';
import type { ILabelSpec } from '../../component/label';
import type { IMarkProgressiveConfig } from '../../mark/interface';
import type { SeriesMarkNameEnum } from '../interface/type';
type LineMarks = 'point' | 'line';
export interface ILineSeriesSpec
  extends ICartesianSeriesSpec,
    IAnimationSpec<LineMarks, LineAppearPreset>,
    IMarkProgressiveConfig {
  type: 'line';
  xField: string | string[];
  yField: string | string[];
  [SeriesMarkNameEnum.point]?: IMarkSpec<ISymbolMarkSpec>;
  [SeriesMarkNameEnum.line]?: IMarkSpec<ILineMarkSpec>;
  label?: ILabelSpec & {
    position?:
      | 'top'
      | 'bottom'
      | 'left'
      | 'right'
      | 'top-right'
      | 'top-left'
      | 'bottom-right'
      | 'bottom-left'
      | 'center';
  };
  seriesMark?: 'line' | 'point';
  activePoint?: boolean;
}
export interface ILineSeriesTheme extends Omit<ICartesianSeriesTheme, 'label'>, ILineLikeSeriesTheme {
  label?: Partial<ILineSeriesSpec['label']>;
}
export {};
