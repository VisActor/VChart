import type { IMarkSpec } from '../../typings/spec/common';
import type { ICartesianSeriesSpec, ICartesianSeriesTheme } from '../cartesian/interface';
import type { ISymbolMarkSpec, ILineMarkSpec } from '../../typings/visual';
import type { IInvalidType } from '../../typings';
import type { IAnimationSpec } from '../../animation/spec';
import type { LineAppearPreset } from './animation';
import type { ILineLikeSeriesTheme } from '../mixin/line-mixin';
import type { ILabelSpec } from '../../component/label';
import type { IMarkProgressiveConfig } from '../../mark/interface';

type LineMarks = 'point' | 'line';

export interface ILineSeriesSpec
  extends ICartesianSeriesSpec,
    IAnimationSpec<LineMarks, LineAppearPreset>,
    IMarkProgressiveConfig {
  /** 系列类型 */
  type: 'line';
  /**
   * 非合规数据点连接方式
   * @description null，undefined等非法数据点连接方式。
   * 'break'指在该数据点处断开
   * 'link' 指忽略该点保持连续
   * 'zero' 指该点默认数值为0
   * 'ignore' 指不处理
   */
  invalidType?: IInvalidType;
  /**
   * 点图元配置
   */
  point?: IMarkSpec<ISymbolMarkSpec>;
  /**
   * 线图元配置
   */
  line?: IMarkSpec<ILineMarkSpec>;
  /** 标签配置 */
  label?: ILabelSpec & {
    /** 标签位置 */
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
}

export interface ILineSeriesTheme extends Omit<ICartesianSeriesTheme, 'label'>, ILineLikeSeriesTheme {
  label?: Partial<ILineSeriesSpec['label']>;
}
