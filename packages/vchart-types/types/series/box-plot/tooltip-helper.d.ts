import type { ISeriesTooltipHelper } from '../interface';
import { BaseSeriesTooltipHelper } from '../base/tooltip-helper';
import type { Datum, ITooltipPattern, TooltipActiveType } from '../../typings';
import { BOX_PLOT_TOOLTIP_KEYS } from '../../constant/box-plot';
export declare class BoxPlotSeriesTooltipHelper extends BaseSeriesTooltipHelper implements ISeriesTooltipHelper {
    getDefaultTooltipPattern(activeType: TooltipActiveType): ITooltipPattern | null;
    getContentKey: (contentType: BOX_PLOT_TOOLTIP_KEYS) => (datum: any) => string;
    getContentValue: (contentType: BOX_PLOT_TOOLTIP_KEYS) => (datum: any) => any;
    contentShapeColorCallback: (datum: Datum) => any;
    getOutlierFillColor: (datum: Datum) => any;
    isOutlierMark: (datum: Datum) => boolean;
}
