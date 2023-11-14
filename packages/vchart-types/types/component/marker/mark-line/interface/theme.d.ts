import type { IMarkLineLabelPosition } from '@visactor/vrender-components';
import type { ILineMarkSpec } from '../../../../typings';
import type { IMarkerLabelSpec, IMarkerSymbol } from '../../interface';
export interface IMarkLineTheme {
    line?: {
        style?: ILineMarkSpec;
    };
    label?: {
        position?: IMarkLineLabelPosition;
    } & IMarkerLabelSpec;
    startSymbol?: IMarkerSymbol;
    endSymbol?: IMarkerSymbol;
}
