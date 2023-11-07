import type { IAnimationSpec } from '../../../animation/spec';
import type { DirectionType } from '../../../typings';
import type { IMarkSpec, IMarkTheme } from '../../../typings/spec/common';
import type { IRectMarkSpec } from '../../../typings/visual';
import type { SeriesMarkNameEnum } from '../../interface/type';
import type { IProgressSeriesSpec } from '../interface';
import type { LinearProgressAppearPreset } from './animation';
export interface ILinearProgressSeriesSpec extends IProgressSeriesSpec, IAnimationSpec<string, LinearProgressAppearPreset> {
    type: 'linearProgress';
    xField: string | string[];
    yField: string | string[];
    direction?: DirectionType;
    bandWidth?: number;
    [SeriesMarkNameEnum.progress]?: IMarkSpec<IRectMarkSpec> & {
        topPadding?: number;
        bottomPadding?: number;
        leftPadding?: number;
        rightPadding?: number;
    };
    [SeriesMarkNameEnum.track]?: IMarkSpec<IRectMarkSpec>;
}
export interface ILinearProgressSeriesTheme {
    bandWidth?: number;
    [SeriesMarkNameEnum.progress]?: Partial<IMarkTheme<IRectMarkSpec>>;
    [SeriesMarkNameEnum.track]?: Partial<IMarkTheme<IRectMarkSpec>>;
}
