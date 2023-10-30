import type { ICartesianSeriesSpec, ICartesianSeriesTheme } from '../cartesian/interface';
import type { IMarkSpec, IMarkTheme } from '../../typings/spec/common';
import type { ISymbolMarkSpec, IVisualSpecBase, ShapeType, FunctionType } from '../../typings';
import type { IAnimationSpec } from '../../animation/spec';
import type { ScatterAppearPreset, ScatterMarks } from './animation';
import type { ILabelSpec } from '../../component/label';
import type { IMarkProgressiveConfig } from '../../mark/interface';
import type { SeriesMarkNameEnum } from '../interface/type';
import type { Functional } from '@visactor/vrender-components';

export interface IScatterSeriesSpec
  extends ICartesianSeriesSpec,
    IAnimationSpec<ScatterMarks, ScatterAppearPreset>,
    IMarkProgressiveConfig {
  /**
   * 系列类型
   */
  type: 'scatter';
  /**
   * x轴字段
   */
  xField: string | string[];
  /**
   * y轴字段
   */
  yField: string | string[];
  /**
   * 图元配置
   */
  [SeriesMarkNameEnum.point]?: IMarkSpec<ISymbolMarkSpec>;
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

  /** 标签配置 */
  [SeriesMarkNameEnum.label]?: Omit<ILabelSpec, 'position'> & {
    /** 标签位置
     * @since 1.6.0，支持以函数形式配置
     */
    position?: Functional<
      'top' | 'bottom' | 'left' | 'right' | 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'center'
    >;
  };
}

export interface IScatterSeriesTheme extends ICartesianSeriesTheme {
  size?: number;
  shape?: ShapeType;
  [SeriesMarkNameEnum.point]?: Partial<IMarkTheme<ISymbolMarkSpec>>;
}
