import type { StateValueType } from '../../compile/mark';
import type { ConvertToMarkStyleSpec, ILineLikeMarkSpec } from '../../typings/visual';
import { BaseMark } from './base-mark';
import type { IMarkStyle } from '../interface';
export declare abstract class BaseLineMark<T extends ILineLikeMarkSpec = ILineLikeMarkSpec> extends BaseMark<T> {
    protected abstract _getIgnoreAttributes(): string[];
    setStyle<T>(style: Partial<ConvertToMarkStyleSpec<T>> | Partial<IMarkStyle<T>>, state?: StateValueType, level?: number, stateStyle?: import("../interface").IMarkStateStyle<T>): void;
}
