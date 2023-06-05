import type { ICartesianSeriesSpec, ICartesianSeriesTheme } from '../cartesian/interface';
import type { IMarkSpec, IMarkTheme } from '../../typings/spec/common';
import type { ISymbolMarkSpec, IInvalidType, IVisualSpecBase, ShapeType, FunctionType } from '../../typings';
import type { IAnimationSpec } from '../../animation/spec';
import type { ScatterAppearPreset, ScatterMarks } from './animation';
import type { ILabelSpec } from '../../component/label';
import type { IMarkProgressiveConfig } from '../../mark/interface';

export interface IScatterSeriesSpec
  extends ICartesianSeriesSpec,
    IAnimationSpec<ScatterMarks, ScatterAppearPreset>,
    IMarkProgressiveConfig {
  /**
   * 系列类型
   */
  type: 'scatter';
  /**
   * 图元配置
   */
  point?: IMarkSpec<ISymbolMarkSpec>;
  /**
   * 尺寸 视觉通道
   */
  sizeField?: string;
  size?: number | number[] | FunctionType<number> | IVisualSpecBase<unknown, number>;
  /**
   * 形状 视觉通道
   */
  shapeField?: string;
  shape?: ShapeType | ShapeType[] | FunctionType<ShapeType> | IVisualSpecBase<unknown, ShapeType>;
  /**
   * 非合规数据点连接方式
   * @description null，undefined等非法数据点连接方式。
   * 'zero' 指该点默认数值为0
   * 'ignore' 指不处理
   */
  invalidType?: IInvalidType;
  /** 标签配置 */
  label?: ILabelSpec & {
    /** 标签位置 */
    position?: 'top' | 'bottom' | 'left' | 'right' | 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  };
}

export interface IScatterSeriesTheme extends ICartesianSeriesTheme {
  size: number;
  shape: ShapeType;
  point?: Partial<IMarkTheme<ISymbolMarkSpec>>;
}
