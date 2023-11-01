import type { IBarSeriesSpec } from '../bar/interface';
import type { ICartesianSeriesTheme } from '../cartesian/interface';
import type { IMarkSpec, IMarkTheme } from '../../typings/spec/common';
import type { IPositionedTextMarkSpec, IRectMarkSpec, ITextMarkSpec } from '../../typings/visual';
import type { IAnimationSpec } from '../../animation/spec';
import type { RangeColumnAppearPreset } from './animation';
import type { ILabelSpec } from '../../component/label';
import type { SeriesMarkNameEnum } from '../interface/type';
export declare enum PositionEnum {
    middle = "middle",
    start = "start",
    end = "end",
    bothEnd = "bothEnd"
}
export declare enum minMaxPositionEnum {
    middle = "middle",
    start = "start",
    end = "end"
}
type RangeColumnMarks = 'rangeColumn';
export interface IRangeColumnSeriesSpec extends Omit<IBarSeriesSpec, 'type' | 'label' | keyof IAnimationSpec<RangeColumnMarks, RangeColumnAppearPreset>>, IAnimationSpec<RangeColumnMarks, RangeColumnAppearPreset> {
    type: 'rangeColumn';
    minField: string;
    maxField: string;
    [SeriesMarkNameEnum.bar]?: IMarkSpec<IRectMarkSpec>;
    [SeriesMarkNameEnum.label]?: Partial<ILabelSpec> & {
        position?: PositionEnum;
        [SeriesMarkNameEnum.minLabel]?: IMarkSpec<IPositionedTextMarkSpec> & {
            visible: boolean;
            position?: keyof typeof minMaxPositionEnum;
            offset?: number;
            formatMethod?: (text: string | string[], datum?: any) => string | string[];
        };
        [SeriesMarkNameEnum.maxLabel]?: IMarkSpec<IPositionedTextMarkSpec> & {
            visible: boolean;
            position?: minMaxPositionEnum;
            offset?: number;
            formatMethod?: (text: string | string[], datum?: any) => string | string[];
        };
    };
}
export interface IRangeColumnSeriesTheme extends ICartesianSeriesTheme {
    [SeriesMarkNameEnum.bar]?: Partial<IMarkTheme<IRectMarkSpec>>;
    [SeriesMarkNameEnum.label]?: Partial<ILabelSpec> & {
        [SeriesMarkNameEnum.minLabel]?: Partial<IMarkTheme<ITextMarkSpec> & {
            position?: keyof typeof minMaxPositionEnum;
        }>;
        [SeriesMarkNameEnum.maxLabel]?: Partial<IMarkTheme<ITextMarkSpec> & {
            position?: keyof typeof minMaxPositionEnum;
        }>;
    };
}
export interface IRangeColumn3dSeriesSpec extends Omit<IRangeColumnSeriesSpec, 'type'> {
    type: 'rangeColumn3d';
}
export {};
