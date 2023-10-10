import type { IArcMarkSpec, IMarkSpec, IMarkTheme } from '../../../typings';
import type { IPolarSeriesSpec, IPolarSeriesTheme } from '../interface';
export interface IContinuousTickData {
  index?: number;
  value: number;
}
export interface ITickMaskSpec {
  angle?: number;
  offsetAngle?: number;
  forceAlign?: boolean;
}
export interface IProgressLikeSeriesSpec extends IPolarSeriesSpec {
  roundCap?: boolean | [boolean, boolean];
  cornerRadius?: number;
  tickMask?: Omit<IMarkSpec<IArcMarkSpec>, 'state'> & ITickMaskSpec;
}
export interface IProgressLikeSeriesTheme extends IPolarSeriesTheme {
  roundCap?: boolean | [boolean, boolean];
  cornerRadius?: number;
  tickMask?: Omit<IMarkTheme<IArcMarkSpec>, 'state'> & ITickMaskSpec;
}
