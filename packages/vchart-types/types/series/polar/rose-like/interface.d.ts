import type { ILabelSpec } from '../../../component/label';
import type { IPolarSeriesSpec, IPolarSeriesTheme } from '../interface';
export interface IRoseLikeSeriesSpec extends IPolarSeriesSpec {
    label?: Partial<ILabelSpec>;
}
export interface IRoseLikeSeriesTheme extends IPolarSeriesTheme {
    label?: Partial<ILabelSpec>;
}
