import type { IMarkAreaLabelPosition } from '@visactor/vrender-components';
import type { IPolygonMarkSpec } from '../../../../typings';
import type { IMarkerLabelWithoutRefSpec } from '../../interface';
export interface IMarkAreaTheme {
    area?: {
        style?: IPolygonMarkSpec;
    };
    label?: {
        position?: IMarkAreaLabelPosition;
    } & IMarkerLabelWithoutRefSpec;
}
