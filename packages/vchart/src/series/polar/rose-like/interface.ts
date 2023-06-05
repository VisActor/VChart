import type { ILabelSpec } from '../../../component/label';
import type { IPolarSeriesSpec, IPolarSeriesTheme } from '../interface';

export interface IRoseLikeSeriesSpec extends IPolarSeriesSpec {
  /** 标签配置 */
  label?: Partial<ILabelSpec>;
}

export interface IRoseLikeSeriesTheme extends IPolarSeriesTheme {
  /** 标签配置 */
  label?: Partial<ILabelSpec>;
}
