import type { ISeriesTooltipHelper } from '../interface';
import { BaseSeriesTooltipHelper } from '../base/tooltip-helper';
import type { Datum } from '@visactor/vgrammar-core';
export declare class SankeySeriesTooltipHelper extends BaseSeriesTooltipHelper implements ISeriesTooltipHelper {
    protected _getDimensionData: (datum: any) => any;
    markTooltipValueCallback: (datum: Datum) => string | undefined;
}
