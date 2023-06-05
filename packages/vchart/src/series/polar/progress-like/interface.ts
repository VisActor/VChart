import type { IPolarSeriesSpec, IPolarSeriesTheme } from '../interface';

export interface IProgressLikeSeriesSpec extends IPolarSeriesSpec {
  /** 圆角部分是否突出（可分别设置左侧和右侧） */
  roundCap?: boolean | [boolean, boolean];

  /** 圆角半径 */
  cornerRadius?: number;
}

export interface IProgressLikeSeriesTheme extends IPolarSeriesTheme {
  /** 圆角部分是否突出 */
  roundCap?: boolean | [boolean, boolean];

  /** 圆角半径 */
  cornerRadius?: number;
}
