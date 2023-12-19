import { BaseSeriesSpecTransformer } from '../base';
import type { IRoseSeriesSpec, IRoseSeriesTheme } from './interface';
export declare class RoseSeriesSpecTransformer<T extends IRoseSeriesSpec = IRoseSeriesSpec, K extends IRoseSeriesTheme = IRoseSeriesTheme> extends BaseSeriesSpecTransformer<T, K> {
    protected _transformLabelSpec(spec: T): void;
}
