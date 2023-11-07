import type { IMarkSpec, IMarkTheme } from '../..';
import type { IAnimationSpec } from '../../animation/spec';
import type { IMarkProgressiveConfig } from '../../mark/interface';
import type { DirectionType, IBoxPlotMarkSpec, IOutlierMarkSpec } from '../../typings';
import type { ICartesianSeriesSpec, ICartesianSeriesTheme } from '../cartesian/interface';
import type { SeriesMarkNameEnum } from '../interface/type';
export interface IBoxPlotSeriesSpec extends Omit<ICartesianSeriesSpec, 'xField' | 'yField' | 'direction'>, IAnimationSpec<string, string>, IMarkProgressiveConfig {
    type: 'boxPlot';
    direction?: DirectionType;
    xField?: string | string[];
    yField?: string | string[];
    minField?: string;
    maxField?: string;
    q1Field?: string;
    medianField?: string;
    q3Field?: string;
    [SeriesMarkNameEnum.boxPlot]?: IMarkSpec<IBoxPlotMarkSpec>;
    outliersField?: string;
    outliersStyle?: IOutlierMarkSpec;
}
export interface IBoxPlotSeriesTheme extends ICartesianSeriesTheme {
    [SeriesMarkNameEnum.boxPlot]?: Partial<IMarkTheme<IBoxPlotMarkSpec>>;
}
