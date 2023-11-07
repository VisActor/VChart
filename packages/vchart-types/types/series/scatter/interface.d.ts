import type { ICartesianSeriesSpec, ICartesianSeriesTheme } from '../cartesian/interface';
import type { IMarkSpec, IMarkTheme } from '../../typings/spec/common';
import type { ISymbolMarkSpec, IVisualSpecBase, ShapeType, FunctionType } from '../../typings';
import type { IAnimationSpec } from '../../animation/spec';
import type { ScatterAppearPreset, ScatterMarks } from './animation';
import type { ILabelSpec } from '../../component/label';
import type { IMarkProgressiveConfig } from '../../mark/interface';
import type { SeriesMarkNameEnum } from '../interface/type';
export interface IScatterSeriesSpec extends ICartesianSeriesSpec, IAnimationSpec<ScatterMarks, ScatterAppearPreset>, IMarkProgressiveConfig {
    type: 'scatter';
    xField: string | string[];
    yField: string | string[];
    [SeriesMarkNameEnum.point]?: IMarkSpec<ISymbolMarkSpec>;
    sizeField?: string;
    size?: number | number[] | FunctionType<number> | IVisualSpecBase<unknown, number>;
    shapeField?: string;
    shape?: ShapeType | ShapeType[] | FunctionType<ShapeType> | IVisualSpecBase<unknown, ShapeType>;
    [SeriesMarkNameEnum.label]?: ILabelSpec & {
        position?: 'top' | 'bottom' | 'left' | 'right' | 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'center';
    };
}
export interface IScatterSeriesTheme extends ICartesianSeriesTheme {
    size?: number;
    shape?: ShapeType;
    [SeriesMarkNameEnum.point]?: Partial<IMarkTheme<ISymbolMarkSpec>>;
}
